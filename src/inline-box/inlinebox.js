import Command from '@ckeditor/ckeditor5-core/src/command'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import {
	toWidget,
	viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import Swal from 'sweetalert2'
import './theme/inlinebox.css'

export default class Fill extends Plugin {
	static get requires() {
		return [FillTheBlankEditing, FillTheBlankUI]
	}
}

class FillTheBlankEditing extends Plugin {
	static get requires() {
		return [Widget]
	}

	init() {
		console.log('FillTheBlankEditing#init() got called')

		this._defineSchema()
		this._defineConverters()

		this.editor.commands.add('fill', new FillTheBlankCommand(this.editor))

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
				viewElement.hasClass('fill')
			)
		)
	}

	_defineSchema() {
		const schema = this.editor.model.schema

		schema.register('fill', {
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
		const editorConfig = this.editor.config._config

		conversion.for('upcast').elementToElement({
			view: {
				name: 'span',
				classes: 'fill',
			},
			model: (viewElement, { writer: modelWriter }) => {
				// Extract the "name" from "{name}".
				const name = viewElement.getChild(0).data.slice(1, -1)

				return modelWriter.createElement('fill', { name })
			},
		})

		conversion.for('dataDowncast').elementToElement({
			model: 'fill',
			view: (modelItem, { writer: viewWriter }) =>
				createFillView(modelItem, viewWriter),
		})

		conversion.for('editingDowncast').elementToElement({
			model: 'fill',
			view: (modelItem, { writer: viewWriter }) => {
				const widgetElement = createFillView(modelItem, viewWriter)

				// Enable widget handling on a fill element inside the editing view.
				return toWidget(widgetElement, viewWriter)
			},
		})

		// Helper method for both downcast converters.
		function createFillView(modelItem, viewWriter) {
			const name = modelItem.getAttribute('name')

			const fillView = viewWriter.createContainerElement('span', {
				class: 'fill',
				name: editorConfig.fillConfig,
			})

			// Insert the fill name (as a text).
			const innerText = viewWriter.createText(' ' + name + ' ')
			viewWriter.insert(viewWriter.createPositionAt(fillView, 0), innerText)

			return fillView
		}
	}
}

class FillTheBlankCommand extends Command {
	execute() {
		const editor = this.editor

		Swal.fire({
			title: 'Fill the answer',
			input: 'text',
			showCancelButton: true,
			inputValidator: (value) => {
				if (value) {
					// console.log(value)
					_setValue(value)
				} else if (!value) {
					return 'You need to write something!'
				}
			},
		})

		const _setValue = (value) => {
			editor.model.change((writer) => {
				// const simpleBox = writer.createElement('simpleBox')
				// Create a <fill> elment with the "name" attribute...
				const fill = writer.createElement('fill', {
					name: value,
				})
				// writer.append(fill, simpleBox)

				// ... and insert it into the document.
				editor.model.insertContent(fill)

				// Put the selection on the inserted element.
				writer.setSelection(fill, 'on')
			})
		}
	}

	refresh() {
		const model = this.editor.model
		const selection = model.document.selection

		const isAllowed = model.schema.checkChild(selection.focus.parent, 'fill')

		this.isEnabled = isAllowed
	}
}

// create the ui
class FillTheBlankUI extends Plugin {
	init() {
		const editor = this.editor
		const t = editor.t
		const editorConfig = editor.config._config

		// The "fill" dropdown must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add('fill', (locale) => {
			const buttonView = new ButtonView(locale)
			buttonView.set({
				// The t() function helps localize the editor. All strings enclosed in t() can be
				// translated and change when the language of the editor changes.
				label: t('Fill'),
				withText: true,
				tooltip: true,
				isVisible: !editorConfig.isFIllDisable
			})

			// Disable the fill button when the command is disabled.
			const command = editor.commands.get('fill')
			// Bind the state of the button to the command.
			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled')

			// Execute the command when the dropdown item is clicked (executed).
			this.listenTo(buttonView, 'execute', (evt) => {
				editor.execute('fill')
				// editor.editing.view.focus()
			})

			return buttonView
		})
	}
}
