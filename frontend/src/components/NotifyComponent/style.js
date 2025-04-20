import styled from 'styled-components';
import { Result } from 'antd';

export const WrapperNotify = styled(Result)`
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
`;
