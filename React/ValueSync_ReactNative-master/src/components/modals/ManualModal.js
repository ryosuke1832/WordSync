import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const ManualModal = ({ visible, onClose }) => {
  const ManualSection = ({ title, content }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>遊び方</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.overview}>
              <Text style={styles.overviewTitle}>ゲーム概要</Text>
              <Text style={styles.overviewContent}>
                このゲームは、各自に配られた数字の大きさを、お題に沿った会話の中でうまく伝えるゲームです。{'\n'}
                プレイヤーは自分の持つ数字をお題に沿って表現し、全員で協力して正しい順番を目指します。
              </Text>
            </View>

            <ManualSection
              title="1. プレイ人数を選ぼう"
              content="3人から10人までのプレイ可能です"
            />

            <ManualSection
              title="2. プレイヤー名を決めよう"
              content="各プレイヤーの名前を入力しよう"
            />

            <ManualSection
              title="3. テーマを選ぼう"
              content="用意されたテーマから選ぶか、オリジナルのテーマを作成できます"
            />

            <ManualSection
              title="4. 数字の確認"
              content="各プレイヤーは1から100までの数字をランダムで与えれます。自分の数字は他のプレイヤーに見られないように確認してください。"
            />

            <ManualSection
              title="5. ディスカッション"
              content="テーマに沿って、プレイヤー同士で議論します。制限時間は内に、お題に沿った表現で数字をうまく伝えよう。"
            />

            <ManualSection
              title="6. 順位を決める"
              content="議論が終わったら、プレイヤーたちで相談して全員の順番を決めます。数字が小さい順に並べ替えてください。"
            />

            <ManualSection
              title="7. 結果発表"
              content="入力した順番と実際の数字を照らし合わせて、正解を確認します。全員の数字が正しい順番になっていれば勝利です！"
            />

            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>遊ぶコツ！</Text>
              <Text style={styles.tipsContent}>
                • 数字を直接言わず、テーマに沿った表現を工夫しましょう{'\n'}
                • 他のプレイヤーの発言をよく聞いて、数字の大小を推測しましょう{'\n'}
              </Text>
            </View>

            <View style={styles.example}>
              <Text style={styles.exampleTitle}>具体例</Text>
              <Text style={styles.exampleTheme}>お題：「強い生物は？」</Text>
              <View style={styles.exampleContent}>
                <Text style={styles.exampleText}>
                  95を持っているAさん → 「ライオン」{'\n'}
                  50を持っているBさん → 「サル」{'\n'}
                  5を持っているCさん → 「アリ」
                </Text>
                <Text style={styles.exampleDescription}>
                  強い生物という定義は人によって違います。うまく会話で擦り合わせて、与えられた数字通りに並び替えられるようにしましょう！
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: screenWidth * 0.9,
    maxHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  closeButton: {
    position: 'absolute',
    right: -10,
    padding: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  overview: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  overviewContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tips: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  tipsContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  example: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  exampleTheme: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  exampleContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 12,
    borderRadius: 8,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 12,
  },
  exampleDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export default ManualModal;