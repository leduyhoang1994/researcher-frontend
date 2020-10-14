import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../helpers/IntlMessages';
import ReactTable from "react-table";
import { Button, Input, Label, Row } from 'reactstrap';
import Select from 'react-select';
import ConfirmButton from "../../components/common/ConfirmButton";
import "./style.scss"
import { Colxx } from '../../components/common/CustomBootstrap';

const UserTables = ({
  data,
  component,
  options,
  submitChangeRole,
  softDeleteUser
}) => {
  const columns = () => [
    {
      Header: __(component.messages, "Họ"),
      sortable: false,
      accessor: "firstName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Tên"),
      sortable: false,
      accessor: "lastName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Số điện thoại"),
      sortable: false,
      accessor: "phoneNumber",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "E-mail"),
      sortable: false,
      accessor: "email",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Địa chỉ"),
      sortable: false,
      accessor: "address",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Công ty"),
      sortable: false,
      accessor: "company",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Hành động"),
      sortable: false,
      accessor: null,
      width: 270,
      Cell: props => {
        let value = []
        props.original && props.original.userRoles.forEach(item => {
          value.push({ label: item.roleId.description, value: item.roleId.name, id: item.roleId.id })
        })
        let selectedValue = [];
        return (
          <div className="text-left d-block">
            <ConfirmButton
              btnConfig={{
                size: "xs",
                color: "warning"
              }}
              content={{
                close: "Đóng",
                confirm: "Xác nhận"
              }}
              onConfirm={() => {
                submitChangeRole(props.original.id, selectedValue);
              }}
              buttonContent={() => {
                return (
                  <>Quyền hạn</>
                );
              }}
              confirmHeader={() => {
                return (
                  <>Thay đổi quyền hạn</>
                );
              }}
              closeOnConfirm={true}
              confirmContent={() => {
                return (
                  <div>
                    <Row>
                      <Colxx xxs="4">
                        <p>Họ và tên</p>
                      </Colxx>
                      <Colxx xxs="8">
                        <p>Loại quyền hạn</p>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx xxs="4">
                        <p className="pt-2">{props.original.fullName}</p>
                      </Colxx>
                      <Colxx xxs="8">
                        <div className="text-right">
                          <Select
                            isMulti
                            className="react-select text-left"
                            classNamePrefix="react-select"
                            options={options}
                            defaultValue={value}
                            onChange={(e) => {
                              selectedValue = e;
                            }}
                          />
                        </div>
                      </Colxx>
                    </Row>
                  </div>
                );
              }}
            />
            <Button
              className="button ml-2"
              color="primary"
              size="xs"
              onClick={() => {
                window.open(`/info/${props.original.id}`)
              }}
            >
              Cập nhật
              {/* <i className="iconsminds-gear-2"></i> */}
            </Button>
            <Button
              className="button ml-2"
              color="primary"
              size="xs"
              onClick={() => {
                softDeleteUser(props.original.id);
              }}
            >
              {
                props.original.isActive ? "Vô hiệu hóa" : "Tái sử dụng"
              }
              {/* <i className="iconsminds-gear-2"></i> */}
            </Button>
          </div>
        )
      }
    },
  ];

  return (
    <div>
      <ReactTable
        data={data}
        columns={columns()}
        defaultPageSize={10}
        className="mt-4"
        showPagination={false}
      // PaginationComponent={DataTablePagination}
      />
    </div>
  );
};

export default injectIntl(UserTables);