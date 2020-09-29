import React from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class CkCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        // const { editorData } = this.state;
        // ClassicEditor
        //     .create(document.querySelector('#editor'))
        //     .then(editor => {
        //         editor.setData(editorData);
        //     })
        //     .catch(error => {
        //         console.log(false);
        //         console.error(error);
        //     });
    }

    render() {
        return (
            <div id="editor" onDrop={this.props.onDrop} onDragOver={this.props.allowDrop}>
                <CKEditor
                    data={this.props.content}
                    editor={ClassicEditor}
                    config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
                            'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo']
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        // this.props.onChangeEditor(data);
                        console.log({ event, editor, data });
                    }}
                />
            </div>
        );
    }
}

export default CkCalculator;