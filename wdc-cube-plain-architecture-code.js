this.state = {ddd: 1, ccc: 1}
this.setState({ddd: 2})

console.log(this.state) ::=> {ddd: 2, ccc: 1}

--- APP (ViewState + ConversationalState + Controller)

class ChannelEntryScope {

	readonly presenter: ChannelEntryPresenter
	
	constructor(presenter: ChannelEntryPresenter) {
		this.presenter = presenter
	}
	
	private __changed = false
	get changed() { return this.__changed }
	set changed(value: boolean) { this.__changed = value }

    private __name = ''
	get name() { return this.__name }
	set name(value: string) { if(this.__name !== value) { this.__name = value; this.__changed = true } }

}


class ChannelEntryPresenter {

	readonly scope = new ChannelEntryScope(this)

	forceUpdate = () => void

	update() {
		if(scope.changed()) {
			this.forceUpdate()
		}
	}
}

--- GUI

type MainViewProps = {
	className?: string
	scope: MainScope
}

class MainView extends React.Component<MainViewProps> {

	constructor(props: MainViewProps) {
		super(props)
		this.props.scope.presenter.forceUpdate = this.forceUpdate.bind(this)
	}

	render() {
		const { scope } = this.props

		return <div className={this.props.className}>
			<div className={styles.hbox} >
				<button caption="Dashboard" onclick={scope.onOpenDashboard} />
			</div>
			{
				scope.body
					? <ViewSlot className={styles.bodyClass} scope={scope.body} />
					? <InvalidBodyView />
			}
		</div>
	}
	
}

function ViewSlot({ className, scope }: { className? string; scope: unknown}) {
	if(scope instanceof ChannelEntryScope) {
		return <ChannelEntryView className={className} scope={scope as ChannelEntryScope} />
	}

	if(scope instanceof DashboardScope) {
		return <DashboardView className={className} scope={scope as DashboardScope} />
	}
	
	if(scope instanceof DashboardActiveMessageFormScope) {
		return <DashboardActiveMessageFormView className={className} scope={scope as DashboardActiveMessageFormScope} />
	}
	
	/// ...
	
	return <></>
}

///

type WhatsAppAdminProps = {
	className?: string
}

class WhatsAppAdmin extends React.Component<WhatsAppAdminProps> {

	readonly mainPresenter = new MainPresenter()
	
	construct(props: WhatsAppAdminProps) {
		super(props)
		this.mainPresenter.boot()
	}

	render() {
		return <MainView className={this.props.className} scope={this.mainPresenter.scope} />
	}

}

ReactDOM.render(<WhatsAppAdmin />, document.getElementById('root'))

---------

class IntentData {
	parameters = new Map<string, unknown>
	attributes = new Map<string, unknown>

	clear() {
		this.parameters.clear()
		this.attributes.clear()
	}

	setParentSlot(slot: ScopeSlot) {
		this.attributes.set('$748657465', slot)
	}

	getParentSlot(): ScopeSlot {
		return (this.attributes.get('$748657465') as ScopeSlot) ?? NOOP_VOID
	}
}

class DashboardPresenter {

	private parentSlot = NOOP_VOID as ScopeSlot
	
	public async applyParameters(intent: IntentData, initialization: boolean, last: boolean): Promise<boolean> {
		if (initialization) {
			this.parentSlot = intent.getParentSlot()
		}
		
		this.parentSlot(this.scope)
		
		if (last) {
			// TODO
		}
	
		return true
	}
	
	public publishParameters(intent: IntentData): void {
		//
	}
	
}

enum AlertType = {
	SUCCESS = 0,
	INFO = 1,
	WARNING = 2,
	ERROR = 3
}

class AlertScope {
	private __changed = true
	get changed { return this.__changed}
	set changed(value: boolean) { this.__changed = value}

	private __type = AlertType.SUCCESS
	get type() { return this.__type}
	set type(value: AlertType) { if (this.__type !== value) { this.__type = value; this.__changed = true } }
	
	private __message = ''
	get message() { return this.__message}
	set message(value: string) { if (this.__message !== value) { this.__message = value; this.__changed = true } }
}

class MainScope {
	private __changed = true
	get changed { return this.__changed}
	set changed(value: boolean) { this.__changed = value}

	private __body?: IScope
	get body() { return this.__body}
	set body(value?: IScope) { if (this.__body !== value) { this.__body = value; this.__changed = true } }

	private __alert?: AlertScope
	get alert() { return this.__alert}
	set alert(value?: AlertScope) { if (this.__alert !== value) { this.__alert = value; this.__changed = true } }

	onOpenDashboard = NOOP_VOID_PROMISE
	onOpenChats = NOOP_VOID_PROMISE
	onOpenChannels = NOOP_VOID_PROMISE
	onOpenTemplates = NOOP_VOID_PROMISE
}

class MainPresenter {

	private historyManager = new HashHistoryManager()
	
	private updateManager = new UpdateManager(() => this.forceUpdate, this.onBeforeUpdate.bind(this))

	public readonly scope = new MainScope()
	
	public forceUpdate = NOOP_VOID
	
	private dashboardPresenter?: DashboardPresenter
	private dashboardActiveMessageFormPresenter?: DashboardActiveMessageFormPresenter
	private chatsPresenter?: ChatsPresenter
	private channelConfigurationListingPresenter?: ChannelConfigurationListingPresenter
	private channelConfigurationFormPresenter?: ChannelConfigurationFormPresenter
	private templatesConfigurationListingPresenter?: TemplatesConfigurationListingPresenter
	private templatesConfigurationFormPresenter?: TemplatesConfigurationFormPresenter
	
	private currentPlaceBuilder = this.main.bind(this)
	
	private bodySlot: ScopeSlot = (bodyScope) => {
		this.scope.body = bodyScope
		this.update()
	}
	
	public async boot() {
		try {
			this.flipToUrl(this.historyManager.getUrl())
		} catch(caught) {
			this.flipSafePlace(caught)
		}
	}
	
	@debounce()
	update() {
		if(this.scope.changed) {
			this.scope.changed = false
			this.updateManager.push(this.scope)
		}
		
		if (this.scope.alert.changed) {
			this.updateManager.push(this.scope.alert)
		}
	}
	
	public async applyParameters(intent: IntentData, initialization: boolean, last: boolean): Promise<boolean> {
		if (last) {
			// It must be not possible get into here
			// This is a just in case implementation
			this.bodySlot(new InvalidBodyScope())
		} else {
			intent.setParentSlot(this.bodySlot)
		}
		return true
	}
	
	public publishParameters(intent: IntentData): void {
		//
	}
	
	flipToUrl(url: URL) {
		const intentData = IntentHelper.fromUrl(url)
		if (url.path === 'dashboard') {
			this.flipDashboard(intentData)
		} else if (url.path === 'dashboard/activemessage') {
			this.flipDashboardActiveMessageForm(intentData)
		} else if (url.path === 'chats') {
			this.flipChats(intentData)
		} else if (url.path === 'channel/config') {
			this.flipChannelConfigurationListing(intentData)
		} else if (url.path === 'channel/config/form') {
			this.flipChannelConfigurationForm(intentData)
		} else if (url.path === 'template/config') {
			this.flipTemplateConfigurationListing(intentData)
		} else if (url.path === 'template/config/form') {
			this.flipTemplateConfigurationForm(intentData)
		} else {
			throw new Error('No place found: ' + url)
		}
	}

	onOpenDashboard() {
		try {
			this.flipDashboard(this)
		} catch(caught) {
			this.scope.alert = new AlertScope()
			this.scope.alert.type = AlertType.Error
			this.scope.alert.message = caught.message
			this.update()
		}
	}
	
	private flipSafeToCurrentPlace(caught: exception) {
		try {
			this.currentPlaceBuilder()
			return true
		} catch(otherCaught) {
			this.flipSafePlace(otherCaught, caught)
			return false
		}
	}
	
	private releaseUnusedPresenters(preserveMap: Map<unknown, boolean>) {
		// Level 2

		if (this.dashboardActiveMessageFormPresenter && !preserveMap.has(this.dashboardActiveMessageFormPresenter)) {
			this.dashboardActiveMessageFormPresenter.release()
			this.dashboardActiveMessageFormPresenter = undefined
		}
		
		if (this.templatesConfigurationListingPresenter && !preserveMap.has(this.templatesConfigurationListingPresenter)) {
			this.templatesConfigurationListingPresenter.release()
			this.templatesConfigurationListingPresenter = undefined
		}
		
		if (this.templatesConfigurationFormPresenter && !preserveMap.has(this.templatesConfigurationFormPresenter)) {
			this.templatesConfigurationFormPresenter.release()
			this.templatesConfigurationFormPresenter = undefined
		}

		// Level 1
		
		if (this.dashboardPresenter && !preserveMap.has(this.dashboardPresenter)) {
			this.dashboardPresenter.release()
			this.dashboardPresenter = undefined
		}

		if (this.chatsPresenter && !preserveMap.has(this.chatsPresenter)) {
			this.chatsPresenter.release()
			this.chatsPresenter = undefined
		}
		
		if (this.channelConfigurationListingPresenter && !preserveMap.has(this.channelConfigurationListingPresenter)) {
			this.channelConfigurationListingPresenter.release()
			this.channelConfigurationListingPresenter = undefined
		}
		
		if (this.templatesConfigurationListingPresenter && !preserveMap.has(this.TemplatesConfigurationListingPresenter)) {
			this.templatesConfigurationListingPresenter.release()
			this.templatesConfigurationListingPresenter = undefined
		}
	}

	private flipSafePlace(...errors: Error[]) {
		const safeScope = new SafeScope()
		safeScope.errors = errors
		this.scope.body = safeScope
		this.update()
	}
	
	async flipMain(intent: IntentData) {
		await this.flipDashboard(intent)
	}
	
	async flipDashboard(intent: IntentData) {
		try {
			const preserveMap = new Map<unknown, boolean>()
			
			// Level 0
			let hasNext = await this.applyParameters(intent, false, false)
			if(hasNext) {
				// Level 1
				if (!dashboardPresenter) {
					this.dashboardPresenter = new DashboardPresenter()
					hasNext = await this.dashboardPresenter.applyParameters(intent, true, true)
				} else {
					hasNext = await this.dashboardPresenter.applyParameters(intent, false, true)
				}
				preserveMap.set(this.dashboardPresenter, true)
			}
			
			// Optional state clean up
			this.releaseUnusedPresenters(preserveMap)
			
			// State reached
			this.currentPlaceBuilder = this.flipDashboard.bind(this)

			// Publish state identification to URL
			intent.clear()
			this.publishParameters(intent)
			this.dashboardPresenter?.publishParameters(intent)
			this.historyManager.push('/dashboard?'+IntentHelper.toUrl(intent))
		} catch(caught) {
			if(!this.flipSafeToCurrentPlace(caught)) {
				throw caught
			}
		} finally {
			this.update()
		}
	}
	
	async flipDashboardActiveMessageForm(intent: IntentData) {
		try {
			const preserveMap = new Map<unknown, boolean>()

			// Level 0
			let hasNext = this.applyParameters(intent, false, false)
			if (hasNext) {
				// Level 1
				if (!dashboardPresenter) {
					this.dashboardPresenter = new DashboardPresenter()
					hasNext = await this.dashboardPresenter.applyParameters(intent, true, false)
				} else {
					hasNext = await this.dashboardPresenter.applyParameters(intent, false, false)
				}
				preserveMap.set(this.dashboardPresenter, true)	

				if(hasNext) {
					// Level 2
					if (!dashboardActiveMessageFormPresenter) {
						this.dashboardActiveMessageFormPresenter = new DashboardActiveMessageFormPresenter()
						hasNext = await this.dashboardActiveMessageFormPresenter.applyParameters(intent, true, true)
					} else {
						hasNext = await this.chatsPresenter.applyParameters(intent, false, true)
					}
					preserveMap.set(this.dashboardActiveMessageFormPresenter, true)
				}
			}

			// Optional state clean up
			this.releaseUnusedPresenters(preserveMap)

			// State reached
			this.currentPlaceBuilder = this.flipDashboardActiveMessageForm.bind(this)

			// Publish state identification to URL
			intent.clear()
			this.publishParameters(intent)
			this.dashboardPresenter?.publishParameters(intent)
			this.dashboardActiveMessageFormPresenter?.publishParameters(intent)
			this.historyManager.push('/dashboard/activemessage?'+intent.toUrl())
		} catch(caught) {
			if(!this.flipSafeToCurrentPlace(caught)) {
				throw caught
			}
		} finally {
			this.update()
		}
	}
	
	async flipChats(intent: IntentData) {
		try {
			const preserveMap = new Map<unknown, boolean>()
			
			// Level 0
			let hasNext = await this.applyParameters(intent, false, false)
			if (hasNext) {
				// TODO
			}
			
			// State reached
			this.currentPlaceBuilder = this.flipChats.bind(this)

			// Publish state identification to URL
			intent.clear()
			this.publishParameters(intent)
			// TODO
			this.historyManager.push('/dashboard?'+IntentHelper.toUrl(intent))
		} catch(caught) {
			if(!flipSafeToCurrentPlace(caught)) {
				throw caught
			}
		} finally {
			this.update()
		}
	}
	
	async flipChannelConfigurationListing(intent: IntentData) {
		try {
			const preserveMap = new Map<unknown, boolean>()
			
			// Level 0
			let hasNext = await this.applyParameters(intent, false, false)
			if (hasNext) {
				// TODO
			}
			
			// State reached
			this.currentPlaceBuilder = this.flipDashboard.bind(this)

			// Publish state identification to URL
			intent.clear()
			this.publishParameters(intent)
			// TODO
			this.historyManager.push('/dashboard?'+IntentHelper.toUrl(intent))
		} catch(caught) {
			if(!flipSafeToCurrentPlace(caught)) {
				throw caught
			}
		} finally {
			this.update()
		}
	}
	
	async flipChannelConfigurationForm(intent: IntentData) {
		try {
			const preserveMap = new Map<unknown, boolean>()
			
			// Level 0
			let hasNext = await this.applyParameters(intent, false, false)
			if (hasNext) {
				// TODO
			}
			
			// State reached
			this.currentPlaceBuilder = this.flipDashboard.bind(this)

			// Publish state identification to URL
			intent.clear()
			this.publishParameters(intent)
			// TODO
			this.historyManager.push('/dashboard?'+IntentHelper.toUrl(intent))
		} catch(caught) {
			if(!flipSafeToCurrentPlace(caught)) {
				throw caught
			}
		} finally {
			this.update()
		}
	}

	async flipTemplateConfigurationListing(intent: IntentData) {
		try {
			const preserveMap = new Map<unknown, boolean>()
			
			// Level 0
			let hasNext = await this.applyParameters(intent, false, false)
			if (hasNext) {
				// TODO
			}
			
			// State reached
			this.currentPlaceBuilder = this.flipDashboard.bind(this)

			// Publish state identification to URL
			intent.clear()
			this.publishParameters(intent)
			// TODO
			this.historyManager.push('/dashboard?'+IntentHelper.toUrl(intent))
		} catch(caught) {
			if(!flipSafeToCurrentPlace(caught)) {
				throw caught
			}
		} finally {
			this.update()
		}
	}

	async flipTemplateConfigurationForm(intent: IntentData) {
		try {
			const preserveMap = new Map<unknown, boolean>()
			
			// Level 0
			let hasNext = await this.applyParameters(intent, false, false)
			if (hasNext) {
				// TODO
			}
			
			// State reached
			this.currentPlaceBuilder = this.flipDashboard.bind(this)

			// Publish state identification to URL
			intent.clear()
			this.publishParameters(intent)
			// TODO
			this.historyManager.push('/dashboard?'+IntentHelper.toUrl(intent))
		} catch(caught) {
			if(!flipSafeToCurrentPlace(caught)) {
				throw caught
			}
		} finally {
			this.update()
		}
	}
	
	onBeforeUpdate() {
		// TODO
	}

}