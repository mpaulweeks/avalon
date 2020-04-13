import styled from 'styled-components';
import { MissionResult, MissionResultType } from './types';

export const StyledBox = styled.div`
  margin: 1rem 0;
  padding: 0.8rem;
  border: 0.2rem solid green;
`;

export const HostBox = styled(StyledBox)`
  border-color: purple;
`;

export const Board = styled.div`
  display: flex;

  text-align: center;
`;

export const MissionIcon = styled.div<{ result: MissionResult }>`
  font-size: 4rem;
  margin: 0.2em;
  width: 1.5em;
  height: 1.5em;
  border: 1px solid black;
  border-radius: 2em;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;

  ${props => `
    ${props.result === MissionResultType.Neutral ? `
      color: black;
      background-color: white;
    `: ''}
    ${props.result === MissionResultType.Blue ? `
      color: white;
      background-color: blue;
    `: ''}
    ${props.result === MissionResultType.Red ? `
      color: white;
      background-color: red;
    `: ''}
  `}
`;
