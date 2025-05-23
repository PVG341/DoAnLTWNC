import { Row } from "antd";
import styled from "styled-components";

export const WraperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(26, 148, 255);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
`
export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
`