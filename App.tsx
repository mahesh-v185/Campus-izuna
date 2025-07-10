
import React, { useState, useMemo } from 'react';
import { UserRole, View, Classroom, Subject, User, Story, Post, Comment } from './types';
import { useMockData, UserContext } from './hooks/useMockData';
import LoginView from './components/views/LoginView';
import AuthView from './components/views/AuthView';
import OTPView from './components/views/OTPView';
import ProfileSetupView from './components/views/ProfileSetupView';
import MainLayout from './components/layout/MainLayout';
import HomeView from './components/views/HomeView';
import SearchView from './components/views/SearchView';
import CreatePostView from './components/views/CreatePostView';
import CreateStoryView from './components/views/CreateStoryView';
import AcademicsView from './components/views/AcademicsView';
import { ProfileView } from './components/views/ProfileView';
import NotificationsView from './components/views/NotificationsView';
import ChatView from './components/views/ChatView';
import ManageStudentsModal from './components/ManageStudentsModal';
import TimetableEditModal from './components/TimetableEditModal';
import FacultyAssignmentModal from './components/FacultyAssignmentModal';
import ManageSubjectsModal from './components/ManageSubjectsModal';
import AdminDashboardView from './components/views/AdminDashboardView';
import PostOptionsModal from './components/PostOptionsModal';
import StoryViewer from './components/StoryViewer';
import EditProfileModal from './components/EditProfileModal';
import PostViewerModal from './components/PostViewerModal';
import CommentModal from './components/CommentModal';

type AppState = 'ROLE_SELECTION' | 'AUTH' | 'OTP_VERIFICATION' | 'PROFILE_SETUP' | 'LOGGED_IN';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('ROLE_SELECTION');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<View>(View.HOME);
  const [registrationData, setRegistrationData] = useState<any>(null);
  
  const mockData = useMockData();
  const [users, setUsers] = useState<User[]>(mockData.allUsers);
  const [subjects, setSubjects] = useState<Subject[]>(mockData.subjects);
  const [stories, setStories] = useState<Story[]>(mockData.stories);
  const [posts, setPosts] = useState<Post[]>(mockData.posts);
  const { classrooms, attendance, assignments } = mockData;
  
  // Modal and overlay states
  const [isPostOptionsModalOpen, setPostOptionsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [viewingStoryForUser, setViewingStoryForUser] = useState<User | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [viewingCommentsForPost, setViewingCommentsForPost] = useState<Post | null>(null);
  const [managingStudentsFor, setManagingStudentsFor] = useState<Classroom | null>(null);
  const [editingTimetableFor, setEditingTimetableFor] = useState<Classroom | null>(null);
  const [managingFacultyFor, setManagingFacultyFor] = useState<Classroom | null>(null);
  const [managingSubjectsFor, setManagingSubjectsFor] = useState<Classroom | null>(null);

  const handleCreateSubject = (newSubjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
        id: `sub_${Date.now()}_${Math.random()}`,
        ...newSubjectData
    };
    setSubjects(prev => [...prev, newSubject]);
    alert(`Subject "${newSubject.name}" created successfully!`);
  };
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAppState('AUTH');
  };

  const handleAuthSubmit = (data: any, isSignUp: boolean) => {
    if (isSignUp) {
      setRegistrationData(data);
      setAppState('OTP_VERIFICATION');
    } else {
      if (selectedRole) {
        const userToLogin = users.find(u => u.role === selectedRole);
        setCurrentUser(userToLogin || users.find(u => u.role === UserRole.STUDENT)!);
        setAppState('LOGGED_IN');
        setActiveView(View.HOME);
      }
    }
  };

  const handleOtpSuccess = () => {
    setAppState('PROFILE_SETUP');
  };
  
  const handleProfileSetupComplete = (profileData: {
    fullName: string;
    bio: string;
    skills: string[];
    achievements: string[];
    avatar: string;
  }) => {
    if (!registrationData || !selectedRole) return;

    const newUser: User = {
        id: `user_${Date.now()}`,
        name: profileData.fullName,
        role: selectedRole,
        avatar: profileData.avatar || `https://picsum.photos/seed/${profileData.fullName}/200`,
        bio: profileData.bio,
        stats: { posts: 0, followers: 0, following: 0 },
        followerIds: [],
        followingIds: [],
        skills: profileData.skills,
        achievements: profileData.achievements,
        uucms: selectedRole === UserRole.STUDENT ? registrationData.identifier : undefined,
        personalNumber: selectedRole === UserRole.STUDENT ? registrationData.personalNumber : undefined,
        classroomId: undefined,
        coins: 100,
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setAppState('LOGGED_IN');
    setActiveView(View.HOME);
    setRegistrationData(null);
  };
  
  const handleProfileUpdate = (updatedData: {
    fullName: string;
    bio: string;
    skills: string[];
    achievements: string[];
    avatar: string;
  }) => {
    if (!currentUser) return;
    
    const updatedUser = {
        ...currentUser,
        name: updatedData.fullName,
        bio: updatedData.bio,
        skills: updatedData.skills,
        achievements: updatedData.achievements,
        avatar: updatedData.avatar,
    };
    
    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setIsEditProfileModalOpen(false);
    alert('Profile updated successfully!');
  };

  const handleBackToAuth = () => setAppState('AUTH');
  const handleBackToRoleSelection = () => setAppState('ROLE_SELECTION');
  
  const handleLogout = () => {
    setCurrentUser(null);
    setAppState('ROLE_SELECTION');
  };

  const handleRemoveUser = (userId: string) => {
    if(window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        alert('User removed successfully. (Mock)');
    }
  };

  const handleFollowToggle = (userIdToToggle: string) => {
    if (!currentUser) return;

    setUsers(prevUsers => {
      const newUsers = [...prevUsers];
      const currentUserIndex = newUsers.findIndex(u => u.id === currentUser.id);
      const targetUserIndex = newUsers.findIndex(u => u.id === userIdToToggle);

      if (currentUserIndex === -1 || targetUserIndex === -1) return prevUsers;
      
      const me = { ...newUsers[currentUserIndex] };
      const them = { ...newUsers[targetUserIndex] };

      const isFollowing = me.followingIds.includes(userIdToToggle);

      if (isFollowing) {
        me.followingIds = me.followingIds.filter(id => id !== userIdToToggle);
        them.followerIds = them.followerIds.filter(id => id !== currentUser.id);
      } else {
        me.followingIds = [...me.followingIds, userIdToToggle];
        them.followerIds = [...them.followerIds, currentUser.id];
      }

      me.stats.following = me.followingIds.length;
      them.stats.followers = them.followerIds.length;

      newUsers[currentUserIndex] = me;
      newUsers[targetUserIndex] = them;
      
      setCurrentUser(me); // Update current user state as well
      if(viewingProfile?.id === userIdToToggle) setViewingProfile(them);

      return newUsers;
    });
  };
  
  const handleCreateSelection = (type: 'post' | 'story') => {
      setActiveView(type === 'post' ? View.CREATE_POST : View.CREATE_STORY);
      setPostOptionsModalOpen(false);
  };
  
  const handleCreatePost = (caption: string, mediaUrl: string) => {
    if (!currentUser) return;
    
    const newPost: Post = {
        id: `post_${Date.now()}`,
        author: currentUser,
        mediaUrl: mediaUrl,
        mediaType: 'image',
        thumbnailUrl: mediaUrl,
        caption: caption,
        likes: [],
        comments: [],
        timestamp: 'Just now',
        isNotice: false
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setActiveView(View.HOME);
  };
  
  const handleCreateStory = (mediaUrl: string) => {
    if (!currentUser) return;

    const newStory: Story = {
        id: `story_${Date.now()}`,
        author: currentUser,
        mediaUrl: mediaUrl,
        mediaType: 'image',
        timestamp: 'Just now',
    };

    setStories(prevStories => [newStory, ...prevStories]);
    setActiveView(View.HOME);
  };
  
  const handleCancelCreate = () => {
      setActiveView(View.HOME);
  };
  
  const handleLikeToggle = (postId: string) => {
    if (!currentUser) return;

    const updatedPosts = posts.map(p => {
        if (p.id === postId) {
            const isLiked = p.likes.includes(currentUser.id);
            const newLikes = isLiked
                ? p.likes.filter(id => id !== currentUser.id)
                : [...p.likes, currentUser.id];
            return { ...p, likes: newLikes };
        }
        return p;
    });

    setPosts(updatedPosts);

    if (viewingPost?.id === postId) {
        setViewingPost(updatedPosts.find(p => p.id === postId) || null);
    }
  };

  const handleCommentAdd = (postId: string, commentText: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
        id: `comment_${Date.now()}`,
        author: currentUser,
        text: commentText,
        timestamp: 'Just now'
    };
    
    const updatedPosts = posts.map(p => {
        if (p.id === postId) {
            const updatedComments = [...p.comments, newComment];
            return { ...p, comments: updatedComments };
        }
        return p;
    });

    setPosts(updatedPosts);
    
    if (viewingCommentsForPost?.id === postId) {
        setViewingCommentsForPost(updatedPosts.find(p => p.id === postId) || null);
    }
    
    if (viewingPost?.id === postId) {
        setViewingPost(updatedPosts.find(p => p.id === postId) || null);
    }
  };

  const handleShare = async (post: Post) => {
    const shareData = {
        title: `Post by ${post.author.name} on CampusKizuna`,
        text: post.caption,
        url: window.location.href, // Mock URL
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
            alert('Post link copied to clipboard!');
        }
    } catch (err) {
        console.error("Error sharing post:", err);
        alert("Could not share post.");
    }
  };
  
  const renderView = () => {
    if (!currentUser) return null;
    
    switch (activeView) {
      case View.HOME:
        return <HomeView 
          posts={posts}
          currentUser={currentUser}
          allUsers={users}
          stories={stories}
          onViewProfile={(userId) => setViewingProfile(users.find(u => u.id === userId) || null)}
          onViewStory={(userId) => setViewingStoryForUser(users.find(u => u.id === userId) || null)}
          onAddStory={() => setActiveView(View.CREATE_STORY)}
          onLikeToggle={handleLikeToggle}
          onComment={setViewingCommentsForPost}
          onShare={handleShare}
        />;
      case View.SEARCH:
        return <SearchView 
          allUsers={users.filter(u => u.id !== currentUser.id)} 
          onViewProfile={(userId) => setViewingProfile(users.find(u => u.id === userId) || null)} 
        />;
       case View.DASHBOARD:
        if (currentUser.role === UserRole.ADMIN) {
            return <AdminDashboardView users={users.filter(u => u.id !== currentUser.id)} onRemoveUser={handleRemoveUser} />;
        }
        return null;
      case View.CREATE_POST:
        return <CreatePostView onShare={handleCreatePost} onCancel={handleCancelCreate} />;
      case View.CREATE_STORY:
        return <CreateStoryView onShare={handleCreateStory} onCancel={handleCancelCreate} />;
      case View.ACADEMICS:
        return <AcademicsView 
                  user={currentUser} 
                  onManageStudents={setManagingStudentsFor}
                  onEditTimetable={setEditingTimetableFor}
                  onManageFaculty={setManagingFacultyFor}
                  onManageSubjects={setManagingSubjectsFor}
                  allUsers={users}
                  classrooms={classrooms}
                  subjects={subjects}
                  attendance={attendance}
                  assignments={assignments}
               />;
      case View.PROFILE:
        return <ProfileView 
                  userToView={currentUser}
                  currentUser={currentUser}
                  posts={posts.filter(p => p.author.id === currentUser.id)}
                  stories={stories}
                  onLogout={handleLogout}
                  onFollowToggle={handleFollowToggle}
                  onBack={() => {}}
                  isMyProfile={true}
                  onEditProfile={() => setIsEditProfileModalOpen(true)}
                  onViewStory={(userId) => setViewingStoryForUser(users.find(u => u.id === userId) || null)}
                  onViewPost={(post) => setViewingPost(post)}
               />;
      case View.NOTIFICATIONS:
        return <NotificationsView posts={posts} />;
      case View.CHAT:
        return <ChatView />;
      default:
        return <HomeView 
                  posts={posts}
                  currentUser={currentUser}
                  allUsers={users}
                  stories={stories}
                  onViewProfile={(userId) => setViewingProfile(users.find(u => u.id === userId) || null)}
                  onViewStory={(userId) => setViewingStoryForUser(users.find(u => u.id === userId) || null)}
                  onAddStory={() => setActiveView(View.CREATE_STORY)}
                  onLikeToggle={handleLikeToggle}
                  onComment={setViewingCommentsForPost}
                  onShare={handleShare}
                />;
    }
  };

  if (appState === 'ROLE_SELECTION') {
    return <LoginView onRoleSelect={handleRoleSelect} />;
  }

  if (appState === 'AUTH' && selectedRole) {
    return <AuthView role={selectedRole} onAuthSubmit={handleAuthSubmit} onBack={handleBackToRoleSelection} />;
  }
  
  if (appState === 'OTP_VERIFICATION' && selectedRole) {
    return <OTPView role={selectedRole} onVerifySuccess={handleOtpSuccess} onBack={handleBackToAuth} />;
  }

  if (appState === 'PROFILE_SETUP' && registrationData) {
    return <ProfileSetupView onComplete={handleProfileSetupComplete} />;
  }

  if (appState === 'LOGGED_IN' && currentUser) {
    return (
      <UserContext.Provider value={currentUser}>
        <MainLayout 
          activeView={activeView}
          setActiveView={setActiveView}
          userRole={currentUser.role}
          onOpenPostOptions={() => setPostOptionsModalOpen(true)}
        >
          {renderView()}
        </MainLayout>

        {/* Overlays and Modals */}
        {isPostOptionsModalOpen && <PostOptionsModal onSelect={handleCreateSelection} onClose={() => setPostOptionsModalOpen(false)} />}
        {isEditProfileModalOpen && <EditProfileModal currentUser={currentUser} onClose={() => setIsEditProfileModalOpen(false)} onSave={handleProfileUpdate} />}
        {viewingStoryForUser && <StoryViewer user={viewingStoryForUser} stories={stories.filter(s => s.author.id === viewingStoryForUser.id)} onClose={() => setViewingStoryForUser(null)} />}
        {viewingProfile && (
            <ProfileView
                userToView={viewingProfile}
                currentUser={currentUser}
                posts={posts.filter(p => p.author.id === viewingProfile.id)}
                stories={stories}
                onLogout={() => {}}
                onFollowToggle={handleFollowToggle}
                onBack={() => setViewingProfile(null)}
                isMyProfile={viewingProfile.id === currentUser.id}
                onEditProfile={() => setIsEditProfileModalOpen(true)}
                onViewStory={(userId) => setViewingStoryForUser(users.find(u => u.id === userId) || null)}
                onViewPost={(post) => setViewingPost(post)}
            />
        )}
        {viewingPost && (
            <PostViewerModal
                post={viewingPost}
                currentUser={currentUser}
                onClose={() => setViewingPost(null)}
                onViewProfile={(userId) => {
                    setViewingPost(null);
                    setViewingProfile(users.find(u => u.id === userId) || null);
                }}
                onLikeToggle={handleLikeToggle}
                onComment={setViewingCommentsForPost}
                onShare={handleShare}
            />
        )}
        {viewingCommentsForPost && (
            <CommentModal 
                post={viewingCommentsForPost}
                currentUser={currentUser}
                onClose={() => setViewingCommentsForPost(null)}
                onCommentAdd={handleCommentAdd}
            />
        )}
        
        {managingStudentsFor && currentUser?.role === UserRole.ADMIN && (
          <ManageStudentsModal classroom={managingStudentsFor} allUsers={users} allClassrooms={classrooms} onClose={() => setManagingStudentsFor(null)} />
        )}
        {editingTimetableFor && currentUser?.role === UserRole.ADMIN && (
          <TimetableEditModal classroom={editingTimetableFor} allSubjects={subjects} allFaculty={users.filter(u => u.role === UserRole.FACULTY)} onClose={() => setEditingTimetableFor(null)} onSave={() => { alert('Timetable updated!'); setEditingTimetableFor(null); }} />
        )}
        {managingFacultyFor && currentUser?.role === UserRole.ADMIN && (
          <FacultyAssignmentModal classroom={managingFacultyFor} allSubjects={subjects} allFaculty={users.filter(u => u.role === UserRole.FACULTY)} onClose={() => setManagingFacultyFor(null)} onSave={() => { alert('Faculty updated!'); setManagingFacultyFor(null); }}/>
        )}
        {managingSubjectsFor && currentUser?.role === UserRole.ADMIN && (
          <ManageSubjectsModal classroom={managingSubjectsFor} allSubjects={subjects} onClose={() => setManagingSubjectsFor(null)} onSave={() => { alert('Subjects updated!'); setManagingSubjectsFor(null); }} onSubjectCreate={handleCreateSubject} />
        )}
      </UserContext.Provider>
    );
  }

  return <div>Loading...</div>; // Fallback
};