/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
// import CKBox from '@ckeditor/ckeditor5-ckbox/src/ckbox';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
// import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
// import PictureEditing from '@ckeditor/ckeditor5-image/src/pictureediting';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
// import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import MathType from '@wiris/mathtype-ckeditor5';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';
import AudioEmbed from './audio-embed/audioembed';
import Fill from './inline-box/inlinebox';

export default class MindtrexEditor extends ClassicEditorBase {}

// Plugins to include in the build.
MindtrexEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Strikethrough,
	Italic,
	CKFinder,
	// EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
	// MathType,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Alignment,
	Fill,
	Base64UploadAdapter,
	// CustomFigureAttributes,
	MathType,
	HtmlEmbed,
	AudioEmbed
];

// Editor configuration.
MindtrexEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'strikethrough',
			'italic',
			// 'link',
			'bulletedList',
			'numberedList',
			'|',
			// 'indent',
			// 'outdent',
			// '|',
			'fontFamily',
			'fontSize',
			'fontColor',
			'fontBackgroundColor',
			'alignment',
			'|',
			'imageUpload',
			'insertTable',
			'mediaEmbed',
			'audio',
			// 'undo',
			// 'redo',
			'|',
			'MathType',
			'ChemType',
			'fill'
		]
	},
	image: {
		styles: [
			'alignLeft', 'alignCenter', 'alignRight'
		],
		resizeOptions: [
			{
				name: 'resizeImage:original',
				value: null,
				icon: 'original'
			},
			{
				name: 'resizeImage:50',
				value: '50',
				icon: 'medium'
			},
			{
				name: 'resizeImage:75',
				value: '75',
				icon: 'large'
			}
		],
		toolbar: [
			'imageStyle:alignLeft',
			'imageStyle:alignCenter',
			'imageStyle:alignRight',
			'|',
			'resizeImage:50',
			'resizeImage:75',
			'resizeImage:original',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	fontFamily: {
		options: [
			'default',
			'عثمان طه',
			'Ubuntu, Arial, sans-serif',
			'Ubuntu Mono, Courier New, Courier, monospace',
			'Open Sans'
		]
		// supportAllValues: true,
	},
	fontSize: {
		options: [
			'tiny',
			'default',
			'big'
		]
	},
	fillConfig: '',
	isFIllDisable: false,
	alertConfig: {
		errorMessage: 'You need to write the Answer!',
		alertTitle: 'Fill the Answer',
		sweetStyle: {
			width: '500px',
			padding: '1.25em',
			confirmButtonText: 'Save',
			cancelButtonText: 'Close',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			reverseButtons: false
		},
		customClass: {},
		fillBg: {
			class: '.fill'
		}
	},
	htmlEmbed: {
		showPreviews: true,
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
