// __tests__/PinCodeTest.js
import 'react-native';

import React from 'react';

import renderer from 'react-test-renderer';

import ApplicatinLocked from '../dist/src/ApplicationLocked';
import PinCode from '../dist/src/PinCode';
import PinCodeChoose from '../dist/src/PinCodeChoose';
import PinCodeEnter from '../dist/src/PinCodeEnter';

jest.useFakeTimers()

it('PinCode renders correctly', () => {
    const tree = renderer.create(
        <PinCode />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('PinCodeChoose renders correctly', () => {
    const tree = renderer.create(
        <PinCodeChoose />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('PinCodeEnter renders correctly', () => {
    const tree = renderer.create(
        <PinCodeEnter />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it('ApplicatinLocked renders correctly', () => {
    const tree = renderer.create(
        <ApplicatinLocked />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

// https://medium.com/react-native-training/learning-to-test-react-native-with-jest-part-1-f782c4e30101