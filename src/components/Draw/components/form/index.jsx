import React, { useState } from 'react';
import { Container, Row, Label, Input } from "./styles/form"

export default function Form({ children, ...restProps }) {
  return <Container {...restProps}>{children}</Container>;
}

Form.Row = function ({ children, ...restProps }) {
  return <Row {...restProps}>{children}</Row>
}

Form.Label = function ({ children, ...restProps }) {
  return <Label {...restProps}>{children}</Label>
}

Form.Input = function ({ type="text", ...restProps }) {
  return <Input type={type} {...restProps} />
}



