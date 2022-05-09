import React from 'react';
import { Text, View } from 'react-native';
import { Copyright } from '../Copyright';

import { styles } from './styles';
import { feedbackTypes } from '../../utils/feedbackTypes'
import { Option } from '../Option';
import { FeedbackType } from '../Widget';

type OptionsProps = {
  onFeedbackTypeChanged: (feedbackType: FeedbackType) => void
}

export function Options({ onFeedbackTypeChanged }: OptionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Deixe seu feedback
      </Text>

      <View style={styles.options}>
        {
          Object.entries(feedbackTypes).map(([key, value]) => (
            <Option
              image={value.image}
              title={value.title}
              key={key}
              onPress={() => onFeedbackTypeChanged(key as FeedbackType)}
            />
          ))

        }
      </View>
      <Copyright />
    </View>
  );
}
