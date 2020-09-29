import React from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Input, Label } from "reactstrap";

class CkCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        // this.messages = this.props.intl.messages;
    }

    render() {
        const { content } = this.props;
        return (
            <div onDrop={this.props.onDrop} onDragOver={this.props.allowDrop}>
                <Label className="form-group has-float-label">
                    <Input
                        id="editor"
                        rows={5}
                        value={content}
                        type="textarea"
                        spellCheck="false"
                        onChange={this.props.onChangeEditor}
                    />
                    <span>Formula</span>
                </Label>

                {/* <CKEditor
                    data={this.props.content}
                    editor={ClassicEditor}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        // this.props.onChangeEditor(data);
                        console.log(data);
                    }}
                /> */}
            </div>
        );
    }
}

export default CkCalculator;