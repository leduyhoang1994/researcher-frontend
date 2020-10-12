import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";

import { isFunction } from 'formik';
import { currencyFormatVND, numberFormat } from '../../../helpers/Utils';
import { defaultImg } from '../../../constants/defaultValues';

import "./style.scss";
import { Input } from 'reactstrap';

const CartTables = ({
  data,
  component,
  handleCheckAll,
  allProductSelected,
  existInSelectedCart = false,
  addToSelectedCart,
  removeFromSelectedCart
}) => {
  // const handleCheckAlls = (checked, data) => {
  //   handleCheckAll(checked, data)
  // }
  // const allProductSelecteds = (data) => {
  //   allProductSelected(data)
  // }
  // const existInSelected = (original) => {
  //   existInSelectedCart(original)
  // }
  // const addToSelected = (original) => {
  //   addToSelectedCart(original)
  // }
  // const removeFromSelected = (original) => {
  //   removeFromSelectedCart(original)
  // }
  const columns = () => [
    {
      Header: (e) => {
        return (
          <input type="checkbox" onChange={(event) => {
            if (isFunction(handleCheckAll))
            handleCheckAll(event.target.checked, e?.data)
          }} checked={isFunction(allProductSelected) ? allProductSelected(e?.data.map(item => item._original)) : false} />
        )
      },
      accessor: null,
      sortable: false,
      width: 30,
      Cell: props => (
        <div className="text-right">
          <Input
            type="checkbox"
            checked={existInSelectedCart(props.original)}
            onChange={e => {
              if (e.target.checked) {
                addToSelectedCart(props.original);
              } else {
                removeFromSelectedCart(props.original);
              }
            }}
          />
        </div>
      )
    },
    {
      Header: __(component.messages, "Hình ảnh"),
      sortable: false,
      width: 70,
      accessor: "featureImage",
      Cell: props => <img width="60" src={props.value ? `${process.env.REACT_APP_MEDIA_BASE_PATH}${props.value}` : `${process.env.REACT_APP_MEDIA_BASE_PATH}${defaultImg}`} alt="" />
    },
    {
      Header: __(component.messages, "Tên sản phẩm"),
      sortable: false,
      accessor: "name",
      Cell: props => <a target="_blank" rel="noopener noreferrer" href={`/store/products/detail/${props.original.id}`}>{props.value}</a>
    },
    {
      Header: __(component.messages, "Hình thức vận chuyển"),
      sortable: false,
      accessor: "transportation",
      Cell: props => (<p className="text-muted">{props?.value}</p>
        // props?.value ? props?.value.map(item => {
        //   return (
        //     <p className="text-muted">{item}</p>
        //   )
        // }) : null
      )
    },
    {
      Header: __(component.messages, "Khối lượng"),
      sortable: false,
      width: 75,
      accessor: "weight",
      Cell: props => <p className="text-muted">
        {props.value ? (numberFormat(Number.parseFloat(props.value), 3) + " kg") : null}
      </p>
    },
    {
      Header: __(component.messages, "Giá nhập hàng"),
      sortable: false,
      width: 100,
      accessor: "offerPrice",
      Cell: props => <p className="text-muted">
        {props.value ? (currencyFormatVND(Number.parseFloat(props.value)) + " đ") : null}
      </p>
    },
    {
      Header: __(component.messages, "Thời gian giao hàng"),
      sortable: false,
      accessor: "workshopIn",
      Cell: props => <p className="text-muted">
        {props.value ? (numberFormat(Number.parseFloat(props.value), 1) + " ngày") : null}
      </p>
    },
  ];

  return (
    <div>
      <ReactTable
        data={data}
        columns={columns()}
        defaultPageSize={data.length}
        className="cart-table mb-4 -striped -highlight"
        showPagination={false}
        // PaginationComponent={DataTablePagination}
        getTrProps={(state, rowInfo) => {
          if (rowInfo && rowInfo.row) {
            return {
              onClick: (e) => {
                if (existInSelectedCart(rowInfo.original)) {
                  removeFromSelectedCart(rowInfo.original);
                } else {
                  addToSelectedCart(rowInfo.original);
                }
              },
              style: {
                cursor: "pointer"
              }
            }
          } else {
            return {}
          }
        }}
      // style={{
      //   height: "450px"
      // }}
      />
    </div>
  );
};

export default injectIntl(CartTables);