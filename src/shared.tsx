import styled from 'styled-components';
import { MissionResult, MissionResultType } from './types';

export const HostBox = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem;
  border: 0.2rem solid red;
`;

export const Flex = styled.div`
  display: flex;
`;

export const MissionIcon = styled.div<{ result: MissionResult }>`
  font-size: 3rem;
  width: 1em;
  heigth: 1em;
  border: 1px solid black;
  border-radius: 1em;

  ${props => `
    ${props.result === MissionResultType.Neutral && `
      color: black;
      background-color: white;
    `}
    ${props.result === MissionResultType.Blue && `
      color: white;
      background-color: blue;
    `}
    ${props.result === MissionResultType.Red && `
      color: white;
      background-color: red;
    `}
  `}
`;
