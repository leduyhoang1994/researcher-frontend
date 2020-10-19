import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";

import { isFunction } from 'formik';
import { currencyFormatVND, numberFormat } from '../../../helpers/Utils';
import { defaultImg } from '../../../constants/defaultValues';

// import "./style.scss";
import { Button, Input } from 'reactstrap';

const CartTables = ({
  data,
  component,
  handleCheckAll,
  allProductSelected,
  existInSelectedCart = false,
  addToSelectedCart,
  removeFromSelectedCart,
}) => {
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
            checked={isFunction(existInSelectedCart) ? existInSelectedCart(props.original) : false}
            onChange={e => {
              if (e.target.checked) {
                if (isFunction(addToSelectedCart)) addToSelectedCart(props.original);
              } else {
                if (isFunction(removeFromSelectedCart)) removeFromSelectedCart(props.original);
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
      sortable: true,
      accessor: "name",
      Cell: props => <a target="_blank" rel="noopener noreferrer" href={`/store/products/detail/${props.original.id}`}>{props.value}</a>
    },
    {
      Header: __(component.messages, "Hình thức vận chuyển"),
      sortable: true,
      accessor: "transportation",
      Cell: props => (
        <span key={props.original.optionIds}>
          {
            props?.value.length > 0 && props?.value.map((item, index) => {
              return (
                <span key={props.original.optionIds + item.label + index} className="text-muted">{`${item.label}`}, </span>
              )
            })
          }
        </span>
      )

      // props?.value ? props?.value.map(item => {
      //   return (
      //     <p className="text-muted">{item}</p>
      //   )
      // }) : null
    },
    {
      Header: __(component.messages, "Khối lượng"),
      sortable: true,
      width: 75,
      accessor: "weight",
      Cell: props => <p className="text-muted">
        {props.value ? (numberFormat(Number.parseFloat(props.value), 3) + " kg") : null}
      </p>
    },
    {
      Header: __(component.messages, "Giá nhập hàng"),
      sortable: true,
      width: 100,
      accessor: "offerPrice",
      Cell: props => <p className="text-muted">
        {props.value ? (currencyFormatVND(Number.parseFloat(props.value)) + " đ") : null}
      </p>
    },
    {
      Header: __(component.messages, "Thuộc tính"),
      sortable: true,
      width: 100,
      accessor: "property",
      Cell: props => {
        let property = "";
        props.original.property.forEach(item => {
          property = property.concat(item).concat(", ");
        })
        if (property.length > 2) {
          property = property.substr(0, property.length - 2)
        }
        return (
          <p className="text-muted">{property}</p>
        )
      }
    },
    {
      Header: __(component.messages, "Thời gian giao hàng"),
      sortable: true,
      accessor: "workshopIn",
      Cell: props => <p className="text-muted">
        {props.value ? (numberFormat(Number.parseFloat(props.value), 1) + " ngày") : null}
      </p>
    },
    {
      Header: __(component.messages, "Xóa"),
      sortable: false,
      width: 50,
      accessor: "quantity",
      Cell: props =>
        <div>
          <Button
            size="xs"
            className="w-5 w-xs-100"
            color="primary"
            onClick={() => {
              removeFromSelectedCart(props.original)
            }}
          >X</Button>
        </div>
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
        // getTrProps={(state, rowInfo) => {
        //   if (rowInfo && rowInfo.row) {
        //     return {
        //       onClick: (e) => {
        //         if (isFunction(existInSelectedCart) ? existInSelectedCart(rowInfo.original) : false) {
        //           if (isFunction(removeFromSelectedCart)) removeFromSelectedCart(rowInfo.original);
        //         } else {
        //           if (isFunction(addToSelectedCart)) addToSelectedCart(rowInfo.original);
        //         }
        //       },
        //       style: {
        //         cursor: "pointer"
        //       }
        //     }
        //   } else {
        //     return {}
        //   }
        // }}
      // style={{
      //   height: "450px"
      // }}
      />
    </div>
  );
};

export default injectIntl(CartTables);