## A custom CKEditor build from CKEditor 5 classic editor

![enter image description here](https://i.ibb.co/BLWhfyp/Capture.jpg)

## Quick start

First, install the build from npm:
`npm install --save mindtrex-editor`

And use it in your website:

```html
<div id="editor">
	<p>This is the editor content.</p>
</div>

<script src="./node_modules/mindtrex-editor/build/ckeditor.js"></script>

<script>
	MindtrexEditor.create(document.querySelector('#editor'))
		.then((editor) => {
			window.editor = editor
		})
		.catch((error) => {
			console.error('There was a problem initializing the editor.', error)
		})
</script>
```

Or in your JavaScript application:

```js
import MindtrexEditor from 'mindtrex-editor'

MindtrexEditor.create(document.querySelector('#editor'))
	.then((editor) => {
		window.editor = editor
	})
	.catch((error) => {
		console.error('There was a problem initializing the editor.', error)
	})
```

**Note:** If you are planning to integrate CKEditor 5 deep into your application, it is actually more convenient and recommended to install and import the source modules directly (like it happens in `ckeditor.js`). Read more in the [Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html).

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the `LICENSE.md` file or [https://ckeditor.com/legal/ckeditor-oss-license](https://ckeditor.com/legal/ckeditor-oss-license).
