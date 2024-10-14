import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/products`);
      return response.data.map((item) => ({
        ...item,
        key: item.id,
      }));
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`http://localhost:3000/products/${id}`);
    },
    onSuccess() {
      messageApi.success("Xoa san pham thanh cong");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      render: (image) => <Image src={image} width={50} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Xoa san pham"
            description="Hanh dong nay khong the hoan tac"
            okText="Xoa"
            cancelText="Huy"
            onConfirm={() => mutate(item.id)}
          >
            <Button type="primary">Delete</Button>
          </Popconfirm>
          <Link to={`/products/${item.id}/edit`}>
            <Button type="primary">Cap nhat</Button>
          </Link>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Skeleton active />;
  return (
    <div>
      {contextHolder}
      <h2>Quan ly san pham</h2>
      <Link to={`/products/add`}>
        <Button type="primary">Them san pham</Button>
      </Link>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ProductList;
