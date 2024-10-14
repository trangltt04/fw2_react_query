import React from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

const ProductEdit = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/products/${id}`);
      return response.data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (product) => {
      await axios.put(`http://localhost:3000/products/${id}`, product);
    },
    onSuccess() {
      messageApi.success("Cap nhat san pham thanh cong");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  if (isLoading) return <Skeleton active />;
  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={data}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
            {
              min: 3,
              message: "it nhat 3 ky tu",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input your price",
            },
            {
              type: "number",
              min: 0,
              message: "khong duoc de so am",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item label="Image" name="imageUrl">
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductEdit;
