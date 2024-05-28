import styled from "styled-components";

export const Container = styled.div`
    margin: 20px 20px;
    background-color: white;
    border-radius: 10px;
`;

export const TitlePage = styled.div`
    margin-bottom: 20px;
`;

export const Title = styled.h1`
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 10px;
`;

export const ButtonWrapper = styled.div`
    margin-left: auto;

    @media screen and (max-width: 768px) {
        span {
            display: none;
        }
    }
`;
