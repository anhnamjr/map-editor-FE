import styled from "styled-components/macro"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 320px;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  margin: 5px 0;
`;

export const Label = styled.label`
  display: block;
  width: 100%;
  max-width: 100px;
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  max-width: 220px;
`;

export const Feature = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Button = styled.button`
  margin-top: 10px;
  max-width: 90px;
  width: 100%;
  background-color: ${({type}) => (type === "submit" ? "#34495e" : "#eee")};
  border: 0;
  color: ${({type}) => (type === "submit" ? "#fff" : "#000")};
  outline: none;
  font-size: 14px;
  font-weight: normal;
  border-radius: 5px;
  transition: background-color 0.5s;
  padding: 5px 0;

  &:hover {
    background-color: ${({type}) => (type === "submit" ? "#2980b9" : "#f7f7f7")};
  }
`;

