import { useState } from "react";
import { useSignIn } from "../hooks/useSignIn";
import { Button, Checkbox, Flex, Form, Input } from "antd";
import type { SignInRequest } from "../types/auth";

export default function SignIn() {
  const { mutate: signIn, isPending } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = ({ email, password }: SignInRequest) => {
    signIn({ email, password });
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 300, margin: "auto" }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your Email!" }]}
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="/#">Forgot Password</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isPending}>
          Sign In
        </Button>
        or <a href="/signup">Register now!</a>
      </Form.Item>
    </Form>
  );
}
