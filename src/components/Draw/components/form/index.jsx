import React from 'react';
import { Container, Row, Label, Input, Button, Feature } from "./styles/form"

export default function Form({ children, ...restProps }) {
  return <Container {...restProps}>{children}</Container>;
}

Form.Row = function FormRow({ children, ...restProps }) {
  return <Row {...restProps}>{children}</Row>
}

Form.Label = function FormLabel({ children, ...restProps }) {
  return <Label {...restProps}>{children}</Label>
}

Form.Input = function FormInput({ type="text", ...restProps }) {
  return <Input type={type} {...restProps} />
}

Form.Button = function FormButton({ children, ...restProps }) {
  return <Button {...restProps}>{children}</Button>
}

Form.Feature = function FormFeature({ children, ...restProps }) {
  return <Feature {...restProps}>{children}</Feature>
}

