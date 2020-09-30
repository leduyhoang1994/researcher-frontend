import React from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Input, Label } from "reactstrap";
import ContentEditable from 'react-contenteditable'

class CkCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.contentEditable = React.createRef();
        // this.messages = this.props.intl.messages;
    }

    handleChange = evt => {
        this.setState({ html: evt.target.value });
    };

    render() {
        // const { content } = this.props;
        const content = "<p contenteditable='false'>abc</p> <i contenteditable='false'>ghjk</i> <h3 contenteditable='false'>456789</h3>"
        return (
            <div onDrop={this.props.onDrop} onDragOver={this.props.allowDrop}>
                <Label id="label" className="w-100 has-float-label">
                    <ContentEditable
                        id="editor"
                        spellCheck="false"
                        tagName='article'
                        disabled={false}
                        html={content}
                        onChange={this.props.onChangeEditor}
                        onBlur={this.props.onBlurEditor}
                    />
                    <span>Formula *</span>
                </Label>

                {/* <CKEditor
                    data={content}
                    editor={ClassicEditor}
                    // onChange={(event, editor) => {
                    //     const data = editor.getData();
                    //     // this.props.onChangeEditor(data);
                    //     console.log(data);
                    // }}
                /> */}
            </div>
        );
    }
}

export default CkCalculator;