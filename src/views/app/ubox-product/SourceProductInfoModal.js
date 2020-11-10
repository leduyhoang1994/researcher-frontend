import React from 'react';
import { Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { SOURCE_PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';

class SourceProductInfoModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sourceProduct: {},
      sourceProductId: null
    }
  }

  compare( a, b ) {
    if ( a.last_nom < b.last_nom ){
      return -1;
    }
    if ( a.last_nom > b.last_nom ){
      return 1;
    }
    return 0;
  }

  getMapping = () => {
    return {
      "productImage": {
        order: 1,
        label: "Ảnh sản phẩm",
        col: "6",
        render: (value) => {
          return <img width="100%" src={value} alt=""/>;
        }
      },
      "id": {
        order: 1,
        label: "",
        col: "6",
        render: (value) => {
          return "";
        }
      },
      "productTitleVi": {
        label: "Tên tiếng việt",
        render: (value) => {
          return value;
        }
      },
      "productTitleCn": {
        label: "Tên tiếng Trung",
        render: (value) => {
          return value;
        }
      },
      "minPrice": {
        label: "Giá thấp nhất",
        render: (value) => {
          return value;
        }
      },
      "maxPrice": {
        label: "Giá cao nhất",
        render: (value) => {
          return value;
        }
      },
      "logisticFee": {
        label: "Phí vận chuyển",
        render: (value) => {
          return value;
        }
      },
      "monthlySale": {
        label: "Doanh thu hàng tháng",
        render: (value) => {
          return value;
        }
      },
      "numberOfComments": {
        label: "Số lượng bình luận",
        render: (value) => {
          return value;
        }
      },
      "productCategoryCn": {
        label: "Tên thư mục tiếng Trung",
        render: (value) => {
          return value;
        }
      },
      "productCategoryVi": {
        label: "Tên thư mục tiếng Việt",
        render: (value) => {
          return value;
        }
      },
      "productLink": {
        label: "Link sản phẩm",
        render: (value) => {
          return <a href={value}>Link</a>;
        }
      },
      "shopName": {
        label: "Tên shop",
        render: (value) => {
          return value;
        }
      },
      "shopLocation": {
        label: "Địa chỉ shop",
        render: (value) => {
          return value;
        }
      },
      "shopLink": {
        label: "Link shop",
        render: (value) => {
          return <a href={value}>Link</a>;
        }
      },
      "site": {
        label: "Trang gốc",
        render: (value) => {
          return value;
        }
      },
    };
  }

  getSourceProductInfo = (id) => {
    if (!id) {
      return false;
    }
    ApiController.call("GET", `${SOURCE_PRODUCTS.all}/${id}`, {}, data => {
      this.setState({ sourceProduct: data, sourceProductId: id });
      if (this.props.setSourceProductUrl) {
        this.props.setSourceProductUrl(data.productLink);
      }
    });
  }

  componentWillReceiveProps(nextProps, props) {
    if (nextProps.isOpen && nextProps.sourceProductId !== this.state.sourceProductId) {
      this.getSourceProductInfo(nextProps.sourceProductId)
    }
  }

  renderSourceProductInfo = () => {
    const { sourceProduct } = this.state;
    const mapping = this.getMapping();
    //.sort((a, b) => (a.order > b.order) ? 1 : -1)
    const render = [];
    Object.keys(mapping).forEach(key => {
      if (!sourceProduct[key]) {
        return true;
      }
      let fieldRender = (
        <Colxx xxs={mapping[key].col || "6"} key={key} className="mb-1">
          <div>
            <b>
              {mapping[key].label} :
            </b>
          </div>
          <div className="text-muted">
            {mapping[key].render(sourceProduct[key])}
          </div>
        </Colxx>
      );
      render.push(fieldRender);
    });

    return render;
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>
          Thông tin sản phẩm nguồn
        </ModalHeader>
        <ModalBody>
          <Row>
            {
              this.renderSourceProductInfo()
            }
          </Row>
        </ModalBody>
      </Modal>
    )
  }
}

export default SourceProductInfoModal;