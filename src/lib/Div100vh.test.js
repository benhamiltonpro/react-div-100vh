import React from 'react';
import renderer from 'react-test-renderer';
import Div100vh from './Div100vh';

// I wonder why this doesn't work?
// const getWindowHeight = jest.fn();
// getWindowHeight.mockReturnValue(1000);
// so I have to use this instead
window.innerHeight = 1000;

const renderComponent = props => renderer.create(<Div100vh {...props} />);
const getDivProps = component => component.root.findByType('div').props;

it("uses {height: '100rvh'} as a default if style prop is undefined", () => {
  const component = renderComponent({});
  const props = getDivProps(component);
  expect(props).toEqual({ style: { height: '1000px' } });
});

describe('When style prop is specified and contains no rvh', () => {
  it('does not modify an empty style object', () => {
    const component = renderComponent({ style: {} });
    const props = getDivProps(component);
    expect(props).toEqual({ style: {} });
  });
  it('does not modify a style with height in px', () => {
    const component = renderComponent({ style: { height: '123px' } });
    const props = getDivProps(component);
    expect(props).toEqual({ style: { height: '123px' } });
  });
  it('passes through all style properties unchanged', () => {
    const component = renderComponent({ style: { color: 'green' } });
    const props = getDivProps(component);
    expect(props).toEqual({ style: { color: 'green' } });
  });
});

describe('rvh unit conversion', () => {
  it('converts a simple rvh value', () => {
    const component = renderComponent({ style: { height: '50.5rvh' } });
    const props = getDivProps(component);
    expect(props).toEqual({ style: { height: '505px' } });
  });
  it('converts a shorthand value with multiple rvh entries', () => {
    const component = renderComponent({
      style: { margin: '1rvh 2px 1.5rvh 3%' }
    });
    const props = getDivProps(component);
    expect(props).toEqual({ style: { margin: '10px 2px 15px 3%' } });
  });
  it('converts an rvh value and passes through other style props', () => {
    const component = renderComponent({
      style: { fontSize: '5rvh', color: 'red' }
    });
    const props = getDivProps(component);
    expect(props).toEqual({ style: { fontSize: '50px', color: 'red' } });
  });
});

it('passes through to the underlying div the other props with rvh', () => {
  const component = renderComponent({ foo: 'bar', style: { padding: '1rvh' } });
  const props = getDivProps(component);
  expect(props).toEqual({ foo: 'bar', style: { padding: '10px' } });
});

it('passes through to the underlying div the other props without rvh', () => {
  const component = renderComponent({ foo: 'bar', style: { color: 'red' } });
  const props = getDivProps(component);
  expect(props).toEqual({ foo: 'bar', style: { color: 'red' } });
});
