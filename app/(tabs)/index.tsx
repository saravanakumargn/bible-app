import { Image, StyleSheet, Platform, ScrollView } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Card, Colors, SegmentedControl, Text, TextField, View } from 'react-native-ui-lib';
import { useCallback, useEffect, useState } from 'react';
import { ChatHistory, getChatCompletions, getWarmWelcome } from '../utils/ChatUtils';
import { storage } from '../utils/storage';
import { useLocalSearchParams } from 'expo-router';

const ChatRole = [
  'Scholar',
  'Friend',
  'Guide',
  'Therapist',
]

const ContentLength = [
  'Short',
  'Medium',
  'Long',
]


export default function HomeScreen() {

  const { exploreTheme } = useLocalSearchParams<{ exploreTheme?: string }>();

  const [userChatMessage, setUserChatMessage] = useState<string>('');
  // const [chatResponse, setChatResponse] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [chatRole, setChatRole] = useState<string>();
  const [contentLength, setContentLength] = useState<string>('Short');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');

  useEffect(() => {
    async function getWelcomeMessage() {
      const response = await getWarmWelcome("Please provide a welcoming message for first-time users of our app in very short.");
      setWelcomeMessage(response.choices[0].message.content);
    }
    getWelcomeMessage();

  }, []);

  const onChangeText = useCallback((text: string) => {
    setUserChatMessage(text);
  }, []);

  const onChatCall = useCallback(async (message: string) => {
    setIsLoading(true);
    try {

      setUserChatMessage('');
      const chatRequest = [
        ...chatHistory,
        { role: 'user', content: message },
      ]
      const chatResponse = await getChatCompletions(chatRequest, contentLength, chatRole);
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: chatResponse.choices[0].message.content },
      ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
    , [chatHistory, userChatMessage]);

  const onChatSubmit = useCallback(async () => {
    onChatCall(userChatMessage);
  }
    , [chatHistory, userChatMessage]);

  useEffect(() => {
    if (exploreTheme) {
      onChatCall(exploreTheme);
    }

  }, [exploreTheme]);

  const onSaveMessage = useCallback((message) => () => {
    console.log('Save message', message);
    // store on mmkv save in array
    const existingMessages = storage.getString('messages');
    let messagesArray = existingMessages ? JSON.parse(existingMessages) : [];
    messagesArray.push(message);
    storage.set('messages', JSON.stringify(messagesArray));
  }
    , []);

  return (
    <View flex margin-s3>
      <ScrollView style={{
        flex: 1,
      }}>
        <SegmentedControl segments={[
          {
            label: 'Scholar',
          },
          {
            label: 'Friend',
          },
          {
            label: 'Guide',
          },
          {
            label: 'Therapist',
          }
        ]}
          onChangeIndex={(index) => {
            const role = ChatRole[index];
            setChatRole(role);
          }}
        />
        <SegmentedControl segments={[
          {
            label: 'Short',
          },
          {
            label: 'Medium',
          },
          {
            label: 'Long',
          }
        ]}
          onChangeIndex={(index) => {
            const contentLen = ContentLength[index];
            setContentLength(contentLen);
          }}
        />
        <View flex>
          <Card padding-s2 marginV-s3>
            <ThemedText>{welcomeMessage}</ThemedText>
          </Card>
          {chatHistory.map((chat, index) => (
            <View key={index} marginB-s2 style={[
              styles.container
            ]}>
              {chat.role === 'user' && (
                <View style={styles.userMessage}>
                  <ThemedText>{chat.content}</ThemedText>
                </View>
              )}
              {chat.role === 'assistant' && (
                <View style={styles.systemMessage}>
                  <ThemedText>{chat.content}</ThemedText>
                  <View left>
                    <Button label='Save' onPress={onSaveMessage(chat.content)} />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <View row>
        <View flex>
          <TextField value={userChatMessage}
            placeholder={'Placeholder'}
            floatingPlaceholder
            onChangeText={onChangeText}
          />
        </View>
        <Button label='Chat' onPress={onChatSubmit} disabled={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  userMessage: {
    backgroundColor: Colors.green70,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  systemMessage: {
    backgroundColor: Colors.red80,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
});
