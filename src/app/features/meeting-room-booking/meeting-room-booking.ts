import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  DoorOpen,
  Filter,
  Monitor,
  Plus,
  Search,
  Users,
  Video,
  Wrench,
  X,
  XCircle,
  LucideAngularModule
} from 'lucide-angular';

type MeetingStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

interface Meeting {
  id: string;
  title: string;
  organizer: string;
  room: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  status: MeetingStatus;
  type: 'Internal' | 'External' | 'Interview' | 'Training';
  visitorCount: number;
}

interface MeetingRoom {
  name: string;
  location: string;
  capacity: number;
  status: RoomStatus;
  equipment: string[];
  nextBooking: string;
}

@Component({
  selector: 'app-meeting-room-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './meeting-room-booking.html',
  styleUrl: './meeting-room-booking.scss'
})
export class MeetingRoomBookingComponent {
  readonly icons = {
    calendar: CalendarDays,
    check: CheckCircle2,
    clock: Clock3,
    door: DoorOpen,
    filter: Filter,
    monitor: Monitor,
    plus: Plus,
    search: Search,
    users: Users,
    video: Video,
    wrench: Wrench,
    x: X,
    cancelled: XCircle
  };

  searchTerm = '';
  statusFilter = 'All';
  roomFilter = 'All';
  showNewMeeting = false;

  newMeeting = {
    title: '',
    organizer: '',
    room: 'Atlas',
    date: '2026-11-20',
    start: '14:00',
    end: '15:00',
    attendees: 4,
    type: 'Internal'
  };

  rooms: MeetingRoom[] = [
    { name: 'Atlas', location: 'HQ · Floor 2', capacity: 12, status: 'Available', equipment: ['Display', 'Teams', 'Whiteboard'], nextBooking: '14:00' },
    { name: 'Caspian', location: 'HQ · Floor 2', capacity: 8, status: 'Occupied', equipment: ['Display', 'Zoom', 'Camera'], nextBooking: '12:30' },
    { name: 'Persepolis', location: 'HQ · Floor 3', capacity: 20, status: 'Available', equipment: ['LED Wall', 'Teams', 'VC'], nextBooking: '15:30' },
    { name: 'Hamedan', location: 'Training Center', capacity: 30, status: 'Maintenance', equipment: ['Projector', 'Audio'], nextBooking: '—' }
  ];

  meetings: Meeting[] = [
    { id: 'MTG-2081', title: 'جلسه برنامه‌ریزی فصل چهارم', organizer: 'علی رضایی', room: 'Atlas', date: '2026-11-20', start: '10:00', end: '11:00', attendees: 8, status: 'Completed', type: 'Internal', visitorCount: 0 },
    { id: 'MTG-2082', title: 'Vendor Review — Global Systems', organizer: 'رضا موسوی', room: 'Caspian', date: '2026-11-20', start: '11:30', end: '12:30', attendees: 6, status: 'In Progress', type: 'External', visitorCount: 2 },
    { id: 'MTG-2083', title: 'مصاحبه کارشناس پشتیبانی', organizer: 'نگار احمدی', room: 'Atlas', date: '2026-11-20', start: '13:00', end: '14:00', attendees: 3, status: 'Scheduled', type: 'Interview', visitorCount: 1 },
    { id: 'MTG-2084', title: 'جلسه آموزش امنیت اطلاعات', organizer: 'مریم صادقی', room: 'Persepolis', date: '2026-11-20', start: '15:30', end: '17:00', attendees: 18, status: 'Scheduled', type: 'Training', visitorCount: 0 },
    { id: 'MTG-2085', title: 'جلسه لغوشده پروژه CRM', organizer: 'سینا مرادی', room: 'Caspian', date: '2026-11-20', start: '17:00', end: '18:00', attendees: 5, status: 'Cancelled', type: 'Internal', visitorCount: 0 }
  ];

  get filteredMeetings(): Meeting[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.meetings.filter(meeting => {
      const statusOk = this.statusFilter === 'All' || meeting.status === this.statusFilter;
      const roomOk = this.roomFilter === 'All' || meeting.room === this.roomFilter;
      const text = [meeting.id, meeting.title, meeting.organizer, meeting.room, meeting.type].join(' ').toLowerCase();
      return statusOk && roomOk && (!q || text.includes(q));
    });
  }

  get todayMeetings(): number { return this.meetings.length; }
  get activeMeetings(): number { return this.meetings.filter(m => m.status === 'In Progress').length; }
  get occupiedRooms(): number { return this.rooms.filter(r => r.status === 'Occupied').length; }
  get availableRooms(): number { return this.rooms.filter(r => r.status === 'Available').length; }
  get visitorAttendees(): number { return this.meetings.reduce((sum, m) => sum + m.visitorCount, 0); }

  roomLocation(roomName: string): string {
    return this.rooms.find(room => room.name === roomName)?.location ?? '—';
  }

  createMeeting(): void {
    if (!this.newMeeting.title.trim() || !this.newMeeting.organizer.trim()) return;

    const id = `MTG-${2086 + this.meetings.length}`;
    this.meetings = [{
      id,
      title: this.newMeeting.title.trim(),
      organizer: this.newMeeting.organizer.trim(),
      room: this.newMeeting.room,
      date: this.newMeeting.date,
      start: this.newMeeting.start,
      end: this.newMeeting.end,
      attendees: Number(this.newMeeting.attendees) || 1,
      status: 'Scheduled',
      type: this.newMeeting.type as Meeting['type'],
      visitorCount: this.newMeeting.type === 'External' ? 1 : 0
    }, ...this.meetings];

    this.showNewMeeting = false;
    this.newMeeting = {
      title: '',
      organizer: '',
      room: 'Atlas',
      date: '2026-11-20',
      start: '14:00',
      end: '15:00',
      attendees: 4,
      type: 'Internal'
    };
  }

  cancelMeeting(meeting: Meeting): void {
    if (meeting.status === 'Scheduled') meeting.status = 'Cancelled';
  }

  startMeeting(meeting: Meeting): void {
    if (meeting.status === 'Scheduled') meeting.status = 'In Progress';
  }

  finishMeeting(meeting: Meeting): void {
    if (meeting.status === 'In Progress') meeting.status = 'Completed';
  }

  roomStatusClass(status: RoomStatus): string {
    return status.toLowerCase().replace(' ', '-');
  }

  meetingStatusClass(status: MeetingStatus): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
