"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Share, 
  Settings, 
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Monitor,
  Volume2,
  VolumeX,
  UserPlus,
  Shield,
  Crown,
  Star,
  Clock,
  Calendar,
  Hand,
  AlertCircle,
  CheckCircle,
  X,
  Bell,
  Maximize2,
  Minimize2,
  Grid3X3,
  Layout,
  CircleDot,
  StopCircle,
  FileText,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalLow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserInfo } from '@/hooks/useUserInfo';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'host' | 'co-host' | 'participant';
  isSpeaking: boolean;
  isVideoOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  isMuted: boolean;
  isVideoDisabled: boolean;
  permissions: {
    canSpeak: boolean;
    canShareVideo: boolean;
    canShareScreen: boolean;
    canChat: boolean;
    canRaiseHand: boolean;
  };
  connectionQuality: 'excellent' | 'good' | 'poor';
  joinTime: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isHost: boolean;
  isSystem: boolean;
}

interface MeetingRequest {
  id: string;
  type: 'unmute' | 'enable_video' | 'speak' | 'screen_share';
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'denied';
}

export default function MeetingPage() {
  const { user } = useUserInfo();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');
  const [chatMessage, setChatMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'spotlight' | 'sidebar'>('grid');
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showRequests, setShowRequests] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isHost, setIsHost] = useState(false);
  
  const [meetingInfo, setMeetingInfo] = useState({
    title: 'Advanced React Patterns & Performance Optimization',
    startTime: new Date('2024-03-25T14:30:00'),
    endTime: new Date('2024-03-25T15:30:00'),
    sessionId: '1',
    meetingId: 'meet_123456789',
    isLocked: false,
    isRecording: false,
    participantsCount: 4,
    maxParticipants: 50
  });

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: '/assets/images/user/user-01.png',
      role: 'host',
      isSpeaking: true,
      isVideoOn: true,
      isMicOn: true,
      isScreenSharing: false,
      isHandRaised: false,
      isMuted: false,
      isVideoDisabled: false,
      permissions: {
        canSpeak: true,
        canShareVideo: true,
        canShareScreen: true,
        canChat: true,
        canRaiseHand: true,
      },
      connectionQuality: 'excellent',
      joinTime: new Date('2024-03-25T14:25:00'),
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatar: '/assets/images/user/user-02.png',
      role: 'participant',
      isSpeaking: false,
      isVideoOn: true,
      isMicOn: false,
      isScreenSharing: false,
      isHandRaised: true,
      isMuted: true,
      isVideoDisabled: false,
      permissions: {
        canSpeak: false,
        canShareVideo: true,
        canShareScreen: false,
        canChat: true,
        canRaiseHand: true,
      },
      connectionQuality: 'good',
      joinTime: new Date('2024-03-25T14:28:00'),
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      avatar: '/assets/images/user/user-03.png',
      role: 'participant',
      isSpeaking: false,
      isVideoOn: false,
      isMicOn: true,
      isScreenSharing: false,
      isHandRaised: false,
      isMuted: false,
      isVideoDisabled: true,
      permissions: {
        canSpeak: true,
        canShareVideo: false,
        canShareScreen: false,
        canChat: true,
        canRaiseHand: true,
      },
      connectionQuality: 'poor',
      joinTime: new Date('2024-03-25T14:29:00'),
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      avatar: '/assets/images/user/user-04.png',
      role: 'co-host',
      isSpeaking: false,
      isVideoOn: true,
      isMicOn: true,
      isScreenSharing: false,
      isHandRaised: false,
      isMuted: false,
      isVideoDisabled: false,
      permissions: {
        canSpeak: true,
        canShareVideo: true,
        canShareScreen: true,
        canChat: true,
        canRaiseHand: true,
      },
      connectionQuality: 'excellent',
      joinTime: new Date('2024-03-25T14:27:00'),
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      message: 'Welcome everyone! Let\'s get started with our React session.',
      timestamp: new Date('2024-03-25T14:30:00'),
      isHost: true,
      isSystem: false,
    },
    {
      id: '2',
      userId: '2',
      userName: 'Michael Chen',
      message: 'Hi Sarah! Looking forward to learning about performance optimization.',
      timestamp: new Date('2024-03-25T14:31:00'),
      isHost: false,
      isSystem: false,
    },
    {
      id: '3',
      userId: 'system',
      userName: 'System',
      message: 'Michael Chen raised their hand',
      timestamp: new Date('2024-03-25T14:32:00'),
      isHost: false,
      isSystem: true,
    },
    {
      id: '4',
      userId: '3',
      userName: 'Emily Rodriguez',
      message: 'Same here! I\'ve been struggling with React re-renders.',
      timestamp: new Date('2024-03-25T14:33:00'),
      isHost: false,
      isSystem: false,
    },
  ]);

  // Mock requests
  useEffect(() => {
    setRequests([
      {
        id: '1',
        type: 'unmute',
        fromUserId: '2',
        fromUserName: 'Michael Chen',
        toUserId: '1',
        toUserName: 'Sarah Johnson',
        timestamp: new Date('2024-03-25T14:32:00'),
        status: 'pending',
      },
      {
        id: '2',
        type: 'enable_video',
        fromUserId: '3',
        fromUserName: 'Emily Rodriguez',
        toUserId: '1',
        toUserName: 'Sarah Johnson',
        timestamp: new Date('2024-03-25T14:33:00'),
        status: 'pending',
      },
    ]);
  }, []);

  const currentUser = participants.find(p => p.id === user?.id) || participants[0];
  const isCurrentUserHost = currentUser.role === 'host' || currentUser.role === 'co-host';

  const handleSendMessage = () => {
    if (chatMessage.trim() && currentUser.permissions.canChat) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        message: chatMessage.trim(),
        timestamp: new Date(),
        isHost: currentUser.role === 'host',
        isSystem: false,
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const handleRaiseHand = () => {
    if (currentUser.permissions.canRaiseHand) {
      setIsHandRaised(!isHandRaised);
      setParticipants(prev => 
        prev.map(p => 
          p.id === currentUser.id 
            ? { ...p, isHandRaised: !isHandRaised }
            : p
        )
      );
    }
  };

  const handleToggleMic = () => {
    if (currentUser.permissions.canSpeak) {
      setIsMicOn(!isMicOn);
      setParticipants(prev => 
        prev.map(p => 
          p.id === currentUser.id 
            ? { ...p, isMicOn: !isMicOn }
            : p
        )
      );
    } else {
      // Request permission to unmute
      const newRequest: MeetingRequest = {
        id: Date.now().toString(),
        type: 'unmute',
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        toUserId: participants.find(p => p.role === 'host')?.id || '1',
        toUserName: participants.find(p => p.role === 'host')?.name || 'Sarah Johnson',
        timestamp: new Date(),
        status: 'pending',
      };
      setRequests(prev => [...prev, newRequest]);
      addNotification('Permission request sent to host', 'info');
    }
  };

  const handleToggleVideo = () => {
    if (currentUser.permissions.canShareVideo) {
      setIsVideoOn(!isVideoOn);
      setParticipants(prev => 
        prev.map(p => 
          p.id === currentUser.id 
            ? { ...p, isVideoOn: !isVideoOn }
            : p
        )
      );
    } else {
      // Request permission to enable video
      const newRequest: MeetingRequest = {
        id: Date.now().toString(),
        type: 'enable_video',
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        toUserId: participants.find(p => p.role === 'host')?.id || '1',
        toUserName: participants.find(p => p.role === 'host')?.name || 'Sarah Johnson',
        timestamp: new Date(),
        status: 'pending',
      };
      setRequests(prev => [...prev, newRequest]);
      addNotification('Video permission request sent to host', 'info');
    }
  };

  const handleScreenShare = () => {
    if (currentUser.permissions.canShareScreen) {
      setIsScreenSharing(!isScreenSharing);
      setParticipants(prev => 
        prev.map(p => 
          p.id === currentUser.id 
            ? { ...p, isScreenSharing: !isScreenSharing }
            : p
        )
      );
    } else {
      // Request permission to share screen
      const newRequest: MeetingRequest = {
        id: Date.now().toString(),
        type: 'screen_share',
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        toUserId: participants.find(p => p.role === 'host')?.id || '1',
        toUserName: participants.find(p => p.role === 'host')?.name || 'Sarah Johnson',
        timestamp: new Date(),
        status: 'pending',
      };
      setRequests(prev => [...prev, newRequest]);
      addNotification('Screen share permission request sent to host', 'info');
    }
  };

  const handleRequestResponse = (requestId: string, status: 'approved' | 'denied') => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status }
          : req
      )
    );

    const request = requests.find(r => r.id === requestId);
    if (request) {
      if (status === 'approved') {
        // Update participant permissions
        setParticipants(prev => 
          prev.map(p => 
            p.id === request.fromUserId 
              ? {
                  ...p,
                  permissions: {
                    ...p.permissions,
                    canSpeak: request.type === 'unmute' ? true : p.permissions.canSpeak,
                    canShareVideo: request.type === 'enable_video' ? true : p.permissions.canShareVideo,
                    canShareScreen: request.type === 'screen_share' ? true : p.permissions.canShareScreen,
                  }
                }
              : p
          )
        );
        addNotification(`${request.fromUserName}'s request approved`, 'success');
      } else {
        addNotification(`${request.fromUserName}'s request denied`, 'error');
      }
    }
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const getConnectionQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <SignalHigh className="h-3 w-3 text-green-400" />;
      case 'good':
        return <Signal className="h-3 w-3 text-yellow-400" />;
      case 'poor':
        return <SignalLow className="h-3 w-3 text-red-400" />;
      default:
        return <WifiOff className="h-3 w-3 text-red-400" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <TooltipProvider>
      <div className="h-screen flex bg-zinc-900 text-white overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <div className="bg-zinc-800/95 backdrop-blur-sm border-b border-zinc-700 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 max-w-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <h1 className="text-lg font-semibold truncate max-w-xs line-clamp-2">
                  {meetingInfo.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="h-4 w-4" />
                <span>{formatTime(meetingInfo.startTime)} - {formatTime(meetingInfo.endTime)}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {meetingInfo.participantsCount}/{meetingInfo.maxParticipants}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Recording Indicator */}
              {isRecording && (
                <div className="flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1 rounded-full">
                  <CircleDot className="h-3 w-3 animate-pulse" />
                  <span className="text-xs">REC</span>
                </div>
              )}
              
              {/* Connection Quality */}
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                {getConnectionQualityIcon(currentUser.connectionQuality)}
                <span className="hidden sm:inline">Excellent</span>
              </div>
              
              {/* Notifications */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-zinc-700"
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                        {notifications.length}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              {/* Requests (Host Only) */}
              {isCurrentUserHost && pendingRequests.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRequests(!showRequests)}
                      className="relative p-2 hover:bg-zinc-700 bg-orange-600/20 text-orange-400"
                    >
                      <Hand className="h-4 w-4" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-orange-500">
                        {pendingRequests.length}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pending Requests</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-zinc-700"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-zinc-700"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-6 relative">
            <div className={`grid gap-4 h-full ${
              layout === 'grid' 
                ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : layout === 'spotlight'
                ? 'grid-cols-1'
                : 'grid-cols-1 lg:grid-cols-3'
            }`}>
              {participants.map((participant) => (
                <motion.div
                  key={participant.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative bg-zinc-800 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    participant.isSpeaking 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                      : participant.isHandRaised
                      ? 'border-orange-500 shadow-lg shadow-orange-500/25'
                      : 'border-transparent hover:border-zinc-600'
                  } ${layout === 'spotlight' && participant.isSpeaking ? 'col-span-1 row-span-1' : ''}`}
                >
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center relative">
                    {participant.isVideoOn ? (
                      <div className="text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-2">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="bg-zinc-600 text-white">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-zinc-400">Video Stream</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-2 bg-zinc-600">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="bg-zinc-600 text-white">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-zinc-400">Camera Off</p>
                      </div>
                    )}

                    {/* Screen Sharing Indicator */}
                    {participant.isScreenSharing && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        Sharing
                      </div>
                    )}

                    {/* Connection Quality */}
                    <div className="absolute top-2 right-2">
                      {getConnectionQualityIcon(participant.connectionQuality)}
                    </div>

                    {/* Hand Raised Indicator */}
                    {participant.isHandRaised && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
                        <Hand className="h-3 w-3" />
                        Hand
                      </div>
                    )}
                  </div>

                  {/* Participant Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{participant.name}</span>
                        {participant.role === 'host' && <Crown className="h-4 w-4 text-yellow-400" />}
                        {participant.role === 'co-host' && <Shield className="h-4 w-4 text-blue-400" />}
                      </div>
                      <div className="flex items-center gap-1">
                        {!participant.isMicOn && <MicOff className="h-4 w-4 text-red-400" />}
                        {participant.isMuted && <Lock className="h-4 w-4 text-red-400" />}
                        {participant.isSpeaking && (
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span>Joined {formatTime(participant.joinTime)}</span>
                      {participant.role !== 'participant' && (
                        <Badge variant="secondary" className="text-xs">
                          {participant.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Layout Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLayout('grid')}
                    className={`p-2 ${layout === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-700'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLayout('spotlight')}
                    className={`p-2 ${layout === 'spotlight' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-700'}`}
                  >
                    <Layout className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Spotlight View</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Enhanced Control Bar */}
          <div className="bg-zinc-800/95 backdrop-blur-sm border-t border-zinc-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mic Control */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleToggleMic}
                      variant="ghost"
                      size="lg"
                      className={`p-4 rounded-full transition-all duration-200 ${
                        isMicOn 
                          ? 'bg-zinc-700 hover:bg-zinc-600' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                  </TooltipContent>
                </Tooltip>

                {/* Video Control */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleToggleVideo}
                      variant="ghost"
                      size="lg"
                      className={`p-4 rounded-full transition-all duration-200 ${
                        isVideoOn 
                          ? 'bg-zinc-700 hover:bg-zinc-600' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
                  </TooltipContent>
                </Tooltip>

                {/* Screen Share */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleScreenShare}
                      variant="ghost"
                      size="lg"
                      className={`p-4 rounded-full transition-all duration-200 ${
                        isScreenSharing 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      <Share className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                  </TooltipContent>
                </Tooltip>

                {/* Raise Hand */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRaiseHand}
                      variant="ghost"
                      size="lg"
                      className={`p-4 rounded-full transition-all duration-200 ${
                        isHandRaised 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      <Hand className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
                  </TooltipContent>
                </Tooltip>

                {/* Recording Control (Host Only) */}
                {isCurrentUserHost && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setIsRecording(!isRecording)}
                        variant="ghost"
                        size="lg"
                        className={`p-4 rounded-full transition-all duration-200 ${
                          isRecording 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-zinc-700 hover:bg-zinc-600'
                        }`}
                      >
                        {isRecording ? <StopCircle className="h-5 w-5" /> : <CircleDot className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Leave Meeting */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Leave Meeting</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="w-80 bg-zinc-800/95 backdrop-blur-sm border-l border-zinc-700 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-700">
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'participants' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Participants ({participants.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'chat' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Chat
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'participants' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-zinc-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Participants</h3>
                    {isCurrentUserHost && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 hover:bg-zinc-700">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Invite Participants</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 hover:bg-zinc-700 rounded-lg transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-zinc-600 text-white text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{participant.name}</span>
                          {participant.role === 'host' && <Crown className="h-3 w-3 text-yellow-400" />}
                          {participant.role === 'co-host' && <Shield className="h-3 w-3 text-blue-400" />}
                          {participant.isHandRaised && <Hand className="h-3 w-3 text-orange-400" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          {participant.isSpeaking && <span className="text-green-400">Speaking</span>}
                          {!participant.isMicOn && <MicOff className="h-3 w-3" />}
                          {!participant.isVideoOn && <VideoOff className="h-3 w-3" />}
                          {participant.isMuted && <Lock className="h-3 w-3" />}
                          {getConnectionQualityIcon(participant.connectionQuality)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-zinc-700">
                  <h3 className="font-medium">Chat</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          message.isSystem 
                            ? 'text-zinc-500 italic' 
                            : message.isHost 
                            ? 'text-yellow-400' 
                            : 'text-blue-400'
                        }`}>
                          {message.userName}
                        </span>
                        <span className="text-xs text-zinc-500">{formatTime(message.timestamp)}</span>
                        {message.isHost && <Crown className="h-3 w-3 text-yellow-400" />}
                      </div>
                      <p className={`text-sm ${
                        message.isSystem ? 'text-zinc-500 italic' : 'text-zinc-300'
                      }`}>
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-2 hover:bg-zinc-700">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach File</TooltipContent>
                    </Tooltip>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!currentUser.permissions.canChat}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-2 hover:bg-zinc-700">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Emoji</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!chatMessage.trim() || !currentUser.permissions.canChat}
                          variant="ghost"
                          size="sm"
                          className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send Message</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Requests Panel */}
        <AnimatePresence>
          {showRequests && isCurrentUserHost && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-80 top-0 w-80 h-full bg-zinc-800 border-l border-zinc-700 z-50"
            >
              <div className="p-4 border-b border-zinc-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Pending Requests</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRequests(false)}
                    className="p-1 hover:bg-zinc-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="bg-zinc-700 border-zinc-600">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{request.fromUserName}</span>
                        <Badge variant="secondary" className="text-xs">
                          {request.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 mb-3">
                        Requesting permission to {request.type.replace('_', ' ')}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRequestResponse(request.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestResponse(request.id, 'denied')}
                          className="flex-1"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Deny
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-80 top-0 w-80 h-full bg-zinc-800 border-l border-zinc-700 z-50"
            >
              <div className="p-4 border-b border-zinc-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-zinc-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="bg-zinc-700 border-zinc-600">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-400" />}
                        {notification.type === 'info' && <Bell className="h-4 w-4 text-blue-400" />}
                        {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-400" />}
                        <p className="text-sm">{notification.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
} 