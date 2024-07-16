import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Card, Colors, ColorSwatch, View } from 'react-native-ui-lib';
import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { useMMKVString } from 'react-native-mmkv';
import { getWarmWelcome } from '../utils/ChatUtils';

export default function TabTwoScreen() {

  const [messages, setMessages] = useState([]);
  const [existingMessages] = useMMKVString("messages")

  const [shareMessage, setShareMessage] = useState<string>('');

  useEffect(() => {
    async function getWelcomeMessage() {
      const response = await getWarmWelcome("Give any powerful Quote from the bible to share with friends");
      setShareMessage(response.choices[0].message.content); 
    }
    getWelcomeMessage();

  }, []);

  useEffect(() => {
  // const existingMessages = storage.getString('messages');
  // console.log('existingMessages',existingMessages); 
  setMessages(existingMessages ? JSON.parse(existingMessages) : []);
  }, [])



  return (
    <View flex margin-s3>
      <ScrollView>
        <Card padding-s3 marginB-s3 backgroundColor={Colors.green70}>

      <ThemedText>
        {shareMessage}
      </ThemedText>
        </Card>

      {messages?.map((message, index) => (
        <Card key={message} style={{
          padding: 16,
          marginBottom: 16,
          // borderBottomWidth: 1,
          // borderBottomColor: '#e0e0e0',
        }}>
          <ThemedText>
            {message}
          </ThemedText>
          
          </Card>
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
