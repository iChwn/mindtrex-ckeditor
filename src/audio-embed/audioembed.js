import Command from '@ckeditor/ckeditor5-core/src/command'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import {
	toWidget,
	viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import Swal from 'sweetalert2'

export default class AudioEmbed extends Plugin {
	static get requires() {
		return [AudioEmbedUI, AudioEmbedEditing];
	}

	static get pluginName() {
		return 'AudioEmbed';
	}
}

class AudioEmbedEditing extends Plugin {
	static get requires() {
		return [Widget]
	}

	init() {
		this._defineSchema()
		this._defineConverters()

		this.editor.commands.add('audio', new AudioEmbedCommand(this.editor))

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
				viewElement.hasClass('audio')
			)
		)
	}

	_defineSchema() {
		const schema = this.editor.model.schema

		schema.register('audio', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// The fill will act as an inline node:
			isInline: true,

			// The inline widget is self-contained so it cannot be split by the caret and it can be selected:
			isObject: true,

			// The fill can have many types, like date, name, surname, etc:
			allowAttributes: ['name'],
		})
	}

	_defineConverters() {
		const conversion = this.editor.conversion

		conversion.for('upcast').elementToElement({
			view: {
				name: 'audio',
				classes: 'audio',
			},
			model: (viewElement, { writer: modelWriter }) => {
				// Extract the "name" from "{name}".
				// const name = viewElement.getChild(0).data.slice(1, -1)\
				const name = viewElement.getChild(0).getAttribute('src')
				
				return modelWriter.createElement('audio', { name })
			},
		})

		conversion.for('dataDowncast').elementToElement({
			model: 'audio',
			view: (modelItem, { writer: viewWriter }) =>
				createAudioView(modelItem, viewWriter),
		})

		conversion.for('editingDowncast').elementToElement({
			model: 'audio',
			view: (modelItem, { writer: viewWriter }) => {
				const widgetElement = createAudioView(modelItem, viewWriter)

				// Enable widget handling on a fill element inside the editing view.
				return toWidget(widgetElement, viewWriter)
			},
		})

		// Helper method for both downcast converters.
		function createAudioView(modelItem, viewWriter) {
			const name = modelItem.getAttribute('name')
				
			const fillView = viewWriter.createContainerElement('audio', {
				class: 'audio',
				controls: true
			})
			console.log(fillView)

			// Insert the source with url.
			const sourceView = viewWriter.createContainerElement('source', {
				src: name
			})

			console.log(sourceView)
			viewWriter.insert(viewWriter.createPositionAt(fillView, 0), sourceView)

			return fillView
		}
	}
}

// create the command
class AudioEmbedCommand extends Command {
	execute() {
		const editor = this.editor

		Swal.fire({
			title: 'Insert link audio',
			input: 'text',
			showCancelButton: true,
			inputValidator: value => {
				const audioExtensions = ['mp3', 'wav', 'ogg'];
				const regex = new RegExp(
					`(${audioExtensions.join('|')})$`,
					'i'
				);
				
				if (value) {
					if (!value || !regex.test(value)) {
						// If the URL is not valid, display an error message
						return 'Invalid audio URL';
					} else {
						_setValue(value)
					}
				} else {
					return 'You need to write something!'
				}
			}
		})

		const _setValue = value => {
			editor.model.change(writer => {
				const audio = writer.createElement('audio', {
					name: value,
				})
				editor.model.insertContent(audio)
				writer.setSelection(audio, 'on')
			})
		}
	}

	refresh() {
		const model = this.editor.model
		const selecetion = model.document.selection

		const isAllowed = model.schema.checkChild(selecetion.focus.parent, 'audio')
		this.isEnabled = isAllowed
	}
}

// create the ui
class AudioEmbedUI extends Plugin {
	init() {
		const editor = this.editor
		const t = editor.t
		// const editorConfig = editor.config._config

		// The "audio" dropdown must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add('audio', locale => {
			const buttonView = new ButtonView(locale)
			buttonView.set({
				label: t('Insert Link'),
				icon: `
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1">
					<g id="surface1">
					<path style=" stroke:none;fill-rule:evenodd;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 12.5 19.167969 L 4.742188 14.167969 L 0 14.167969 L 0 5.832031 L 4.742188 5.832031 L 12.5 0.832031 Z M 5 6.660156 L 5 13.339844 L 11.667969 17.636719 L 11.667969 2.363281 Z M 16.855469 3.144531 C 18.796875 4.800781 20 7.261719 20 10 C 20 12.742188 18.796875 15.203125 16.859375 16.859375 L 16.269531 16.269531 C 18.046875 14.777344 19.167969 12.515625 19.167969 10 C 19.167969 7.484375 18.046875 5.222656 16.269531 3.730469 Z M 14.414062 5.585938 C 15.683594 6.632812 16.480469 8.222656 16.480469 10 C 16.480469 11.777344 15.683594 13.367188 14.414062 14.414062 L 13.828125 13.828125 C 14.9375 12.941406 15.644531 11.554688 15.644531 10 C 15.644531 8.449219 14.9375 7.0625 13.824219 6.175781 Z M 4.167969 6.667969 L 0.832031 6.667969 L 0.832031 13.332031 L 4.167969 13.332031 Z M 4.167969 6.667969 "/>
					</g>
					</svg>
				`,
				tooltip: true,
				// isVisible: !editorConfig.isFIllDisable
			});

			// Disable the fill button when the command is disabled.
			const command = editor.commands.get('audio')
			// Bind the state of the button to the command.
			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled')

			// Execute the command when the dropdown item is clicked (executed).
			this.listenTo(buttonView, 'execute', (evt) => {
				editor.execute('audio')
			})
			
			return buttonView
		})
	}
}