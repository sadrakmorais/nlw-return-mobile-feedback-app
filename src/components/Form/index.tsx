import { ArrowArcLeft } from 'phosphor-react-native';
import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system'
import { captureScreen } from 'react-native-view-shot'
import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { theme } from '../../theme';
import { feedbackTypes } from '../../utils/feedbackTypes'

import { styles } from './styles';
import { FeedbackType } from '../../components/Widget'
import { ScreenshotButton } from '../ScreenshotButton'
import { Button } from '../Button';
import { api } from '../../libs/api';
type FormProps = {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}
export function Form({ feedbackType, onFeedbackCanceled, onFeedbackSent }: FormProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const feedbackTypeInfo = feedbackTypes[feedbackType]
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const [comment, setComment] = useState("")

  const handleScreenshot = () => {
    captureScreen({
      format: 'png',
      quality: 0.8,
    })
      .then(uri => setScreenshot(uri))
      .catch(error => console.log(error))
  }

  const handleScreenshotRemove = () => {
    setScreenshot(null)
  }

  const handleSendFeedback = async () => {
    if (isSendingFeedback) {
      return
    }

    setIsSendingFeedback(true)
    const screenshotBse64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' })

    try {
      await api.post('feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBse64}`,
        comment,
      })

      onFeedbackSent()
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowArcLeft
            size={24}
            weight="bold"
            color={theme.colors.surface_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image
            source={feedbackTypeInfo.image}
            style={styles.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput
        onChangeText={setComment}
        autoCorrect={false}
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo."
        placeholderTextColor={theme.colors.text_secondary}
      />
      <View style={styles.footer}>
        <ScreenshotButton
          onRemoveShot={handleScreenshotRemove}
          onTakeShot={handleScreenshot}
          screenshot={screenshot}
        />
        <Button
          onPress={handleSendFeedback}
          isLoading={isSendingFeedback}
        />
      </View>
    </View>
  );
}
