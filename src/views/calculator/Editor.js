import React from "react";
import { Label } from "reactstrap";
import ContentEditable from 'react-contenteditable'

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.contentEditable = React.createRef();
        // this.messages = this.props.intl.messages;
        // var HtmlToReactParser = require('html-to-react').Parser;
        // this.htmlToReactParser = new HtmlToReactParser();
    }

    handleChange = evt => {
        this.setState({ html: evt.target.value });
    };

    render() {
        let { content } = this.props;
        // content = this.htmlToReactParser.parse(content);

        return (
            <div>
                <Label id="label" className="w-100 has-float-label">
                    <ContentEditable
                        id="editor_calculator"
                        // contentEditable
                        spellCheck="false"
                        // tagName='article'
                        // disabled={false}
                        html={content}
                        onChange={this.props.onChangeEditor}
                        onBlur={this.props.onBlurEditor}
                        onClick={this.props.onBlurEditor}
                    />
                        {/* {content} */}
                    {/* </ContentEditable> */}
                    <span>Nội dung công thức *</span>
                </Label>

                {/* <CKEditor
                    data={content}
                    editor={ClassicEditor}
                    // onChange={(event, editor) => {
                    //     const data = editor.getData();
                    //     // this.props.onChangeEditor(data);
                    // }}
                /> */}
            </div>
        );
    }
}

export default Editor;