import React from 'react';
import styled from 'react-emotion';
import { hot } from 'react-hot-loader';

const App = () => <H1>Hello World!</H1>;

const H1 = styled.h1`
  color: red;
`;

export default hot(module)(App);
