import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Shadows } from '../styles';
import { api, getCurrentUser } from '../services/api';
import PatientCard from '../components/PatientCard';

export default function HomeScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [casesLoading, setCasesLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
      loadRecentCases();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      setUserLoading(true);
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setUserLoading(false);
    }
  };

  const loadRecentCases = async () => {
    try {
      setCasesLoading(true);
      const response = await api.get('/cases?limit=5');
      setRecentCases(response.data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
      Alert.alert('Error', 'Failed to load recent cases');
      setRecentCases([]);
    } finally {
      setCasesLoading(false);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('access_token');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const filteredCases = recentCases.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    if (!name) return 'DR';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header with User Profile */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {userLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <>
              {user?.profile_image ? (
                <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profileInitials}>
                    {getInitials(user?.name || 'Doctor')}
                  </Text>
                </View>
              )}
              <View style={styles.userTextContainer}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.userName}>
                  {userLoading ? 'Loading...' : user?.name || 'Doctor'}
                </Text>
              </View>
            </>
          )}
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cases, patients..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Start Consultation Card */}
      <View style={[styles.consultationCard, Shadows.medium]}>
        <Text style={styles.consultationTitle}>Start Consultation</Text>
        <Text style={styles.consultationText}>
          Begin a new case or chronic case intake
        </Text>
        
        <TouchableOpacity
          style={[styles.newCaseBtn, Shadows.small]}
          onPress={() => navigation.navigate('Cases')}
        >
          <Text style={styles.newCaseBtnText}>+ New Case</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Cases Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Cases</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cases')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Cases List */}
      <ScrollView 
        style={styles.casesContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.casesContent}
      >
        {loading || casesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading cases...</Text>
          </View>
        ) : filteredCases.length > 0 ? (
          filteredCases.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('EditCase', { caseId: item.id })}
            >
              <PatientCard
                name={item.patient_name || 'Unknown Patient'}
                initials={getInitials(item.patient_name || 'UP')}
                specialty={item.title || 'Untitled Case'}
                time={getTimeAgo(item.created_at)}
                onPress={() => navigation.navigate('EditCase', { caseId: item.id })}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>No Cases Yet</Text>
            <Text style={styles.emptyStateText}>
              Start your first case to begin medical analysis
            </Text>
            <TouchableOpacity
              style={styles.createCaseBtn}
              onPress={() => navigation.navigate('Cases')}
            >
              <Text style={styles.createCaseBtnText}>Create First Case</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Quick Stats */}
      <View style={[styles.statsContainer, Shadows.small]}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recentCases.length}</Text>
          <Text style={styles.statLabel}>Cases</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {recentCases.filter(c => c.status === 'analyzed').length}
          </Text>
          <Text style={styles.statLabel}>Analyzed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {recentCases.filter(c => c.risk_level === 'high').length}
          </Text>
          <Text style={styles.statLabel}>High Risk</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  userTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  consultationCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  consultationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textWhite,
    marginBottom: 8,
  },
  consultationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  newCaseBtn: {
    backgroundColor: Colors.textWhite,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  newCaseBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  casesContainer: {
    flex: 1,
    marginBottom: 16,
  },
  casesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  createCaseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createCaseBtnText: {
    color: Colors.textWhite,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    height: '60%',
    alignSelf: 'center',
  },
});