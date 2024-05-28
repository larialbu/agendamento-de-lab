import styled from "styled-components";

export const Header = styled.div`
    display: flex;
    align-items: center;
    padding: 4px;
    border-bottom: 1px solid #E2E8F0;

    p {
        font-size: 20px;
        font-weight: bold;
        color: #2D3748;
    }
`

export const IconExit = styled.div`
    position: relative;
    top: 11px;
`

export const Text = styled.p`
    padding:  10px 10px;
    cursor: pointer;
    font-size: 20px;

    &:hover {
        background-color: #bafeb2;
        border-radius: 10px;
    }
`
