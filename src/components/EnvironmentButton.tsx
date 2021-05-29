import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { RectButton, RectButtonProperties } from 'react-native-gesture-handler';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentButtonProps extends RectButtonProperties {
  title: string;
  active?: boolean;
}

export function EnvironmentButton({ title, active = false, ...rest }: EnvironmentButtonProps) {

  return (
    <RectButton
      style={[
        styles.container,
        active && styles.activeContainer
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.title,
          active && styles.activeTitle
        ]}
      >
        {title}
      </Text>
    </RectButton>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.shape,
    width: 76,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5
  },
  activeContainer: {
    backgroundColor: colors.green_light
  },
  title: {
    color: colors.heading,
    fontFamily: fonts.text
  },
  activeTitle: {
    fontFamily: fonts.heading,
    color: colors.green_dark,
  }
})