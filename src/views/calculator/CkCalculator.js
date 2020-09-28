import React from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';


class CkCalculator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editorData: `<h2>Check our last minute deals!</h2>`,
        };
        this.handleEditorDataChange = this.handleEditorDataChange.bind(this);
        this.handleEditorInit = this.handleEditorInit.bind(this);
    }

    componentDidMount() {

    }

    handleEditorDataChange(evt, editor) {
        console.log(evt);
        console.log(editor.getData());
        this.setState({
            editorData: editor.getData()
        });
    }

    handleEditorInit(editor) {
        this.editor = editor;

        this.setState({
            editorData: editor.getData()
        });
        // CKEditor 5 inspector allows you to take a peek into the editor's model and view
        // data layers. Use it to debug the application and learn more about the editor.
        CKEditorInspector.attach(editor);
    }

    render() {
        return (
            <div>
                <CKEditor
                    editor={ClassicEditor}
                    onChange={this.handleEditorDataChange}
                // onInit={this.handleEditorInit}
                />
            </div>
        );
    }
}

export default CkCalculator;