import React, { Component } from 'react';
import { Button, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ManualCrawl from '.';

class ManualCrawlModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { isOpen, toggle, crawledCallback } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="lg"
      >
        <ModalHeader>
          <CardTitle>
            Crawl sản phẩm
          </CardTitle>
        </ModalHeader>
        <ModalBody>
          <ManualCrawl crawledCallback={crawledCallback} />
        </ModalBody>
        <ModalFooter>
          <Button color="default" onClick={toggle}>
            Đóng
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ManualCrawlModal;