import React from "react";
import { Button, Checkbox, Form, Input, InputNumber, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductAdd = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (product) => {
      await axios.post(`http://localhost:3000/products`, product);
    },
    onSuccess() {
      messageApi.success("Them san pham thanh cong");
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
  return (
    <>
      {contextHolder}
      <Form
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
        initialValues={{
          remember: true,
        }}
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

export default ProductAdd;
