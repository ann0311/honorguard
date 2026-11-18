import React, { useState } from 'react';
import { 
  Home, Bell, Calendar, FileText, Folder, Shield, User, 
  Award, LogOut 
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // DB 연동 전까지는 로그인 안 된 상태로 시작

  // 대원 내 정보 스테이트 (DB 연동 시 이 부분이 실시간 데이터로 바뀝니다)
  const [myInfo, setMyInfo] = useState({
    name: '로그인 필요',
    robloxName: '연동 전',
    rank: '대기',
    role: '비회원',
    points: 0,
    maxPoints: 15,
    warnings: 0,
    enlistDate: '연동 전',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ann0311'
  });

  // 탭 목록
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'notice', label: '공지사항', icon: Bell },
    { id: 'event', label: '행사', icon: Calendar },
    { id: 'approval', label: '인가 요청', icon: FileText },
    { id: 'report', label: '보고서', icon: Folder },
    { id: 'document', label: '문서', icon: Shield },
    { id: 'admin', label: '관리패널', icon: Award },
    { id: 'myinfo', label: '내정보', icon: User },
  ];

  // (데모용) 로그인 시뮬레이션 함수
  const handleLogin = async () => {
    try {
      // 실제 운영 시에는 이 부분에 디스코드/로블록스 OAuth 로그인 로직이 들어갑니다.
      // 여기서는 데모를 위해 로컬 스토리지에 임시 데이터를 저장하고 불러옵니다.
      const mockUser = {
        id: 'ann0311-mock-id',
        robloxName: 'Sunwoo_ROKS',
        discordName: '서누#1234',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sunwoo'
      };
      localStorage.setItem('ahras_user', JSON.stringify(mockUser));
      
      // DB profiles 테이블에서 실제 정보를 가져오는 척 시뮬레이션
      setMyInfo({
        name: '서누 (대대장)',
        robloxName: 'Sunwoo_ROKS',
        rank: '하사',
        role: 'admin',
        points: 38, // DB에서 가져온 포인트 예시
        maxPoints: 50, // 하사->중사 진급 포인트
        warnings: 0,
        enlistDate: '2026-11-01',
        avatarUrl: mockUser.avatarUrl
      });
      setIsLoggedIn(true);
      alert('디스코드/로블록스 계정 연동이 완료되었습니다.');

    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  // (데모용) 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('ahras_user');
    setIsLoggedIn(false);
    setMyInfo({
      name: '로그인 필요',
      robloxName: '연동 전',
      rank: '대기',
      role: '비회원',
      points: 0,
      maxPoints: 15,
      warnings: 0,
      enlistDate: '연동 전',
      avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ann0311'
    });
    alert('로그아웃 되었습니다.');
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 상단 네비게이션 헤더 */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 text-white p-2 rounded-lg font-bold text-sm tracking-widest shadow">
            ROK
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              의장대대·Honor Guard <span className="text-xs px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono">AHRAS v2.1</span>
            </h1>
            <p className="text-xs text-slate-400">논산훈련소 군RP 통합 행정 포털 (DB Connected)</p>
          </div>
        </div>

        {/* 탭 메뉴 바 */}
        <nav className="hidden xl:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 우측 유저 상태 및 로그인 버튼 */}
        <div className="flex items-center space-x-3">
          {isLoggedIn && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-emerald-400">{myInfo.robloxName}</span>
              <span className="text-[10px] text-slate-400">{myInfo.rank} / {myInfo.role}</span>
            </div>
          )}
          <button 
            onClick={isLoggedIn ? handleLogout : handleLogin}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <LogOut size={13} />
            <span>{isLoggedIn ? '로그아웃' : '디코/로블 로그인'}</span>
          </button>
        </div>
      </header>

      {/* 모바일 하단 탭 네비게이션 */}
      <div className="xl:hidden flex overflow-x-auto bg-slate-900 border-b border-slate-800 p-2 gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap font-medium ${
                isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-950/40'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {currentTab === 'home' && <HomeTab isLoggedIn={isLoggedIn} />}
        {currentTab === 'notice' && <NoticeTab isLoggedIn={isLoggedIn} />}
        {currentTab === 'event' && <EventTab isLoggedIn={isLoggedIn} />}
        {currentTab === 'approval' && <ApprovalTab isLoggedIn={isLoggedIn} />}
        {currentTab === 'report' && <ReportTab isLoggedIn={isLoggedIn} />}
        {currentTab === 'document' && <DocumentTab isLoggedIn={isLoggedIn} />}
        {currentTab === 'admin' && <AdminTab isLoggedIn={isLoggedIn} userRole={myInfo.role} />}
        {currentTab === 'myinfo' && <MyInfoTab isLoggedIn={isLoggedIn} myInfo={myInfo} />}
      </main>
    </div>
  );
}

// 각 탭 컴포넌트들 (데모 데이터 출력)
function HomeTab({ isLoggedIn }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <Bell size={18} /> 공지 사항 (Notice)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 w-32">작성자</th>
                <th className="p-3">제목</th>
                <th className="p-3 w-28 text-right">작성일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-medium text-emerald-300">대대본부</td>
                <td className="p-3 text-slate-200">[필독] 11월 4주차 국군의장대 정기 사열 및 제식 훈련 안내</td>
                <td className="p-3 text-right text-slate-400">2026.11.18</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-medium text-emerald-300">행정관</td>
                <td className="p-3 text-slate-200">신규 의장대 복제 규정 개정 및 예복 착용 지침</td>
                <td className="p-3 text-right text-slate-400">2026.11.16</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <Calendar size={18} /> 부대 일정 (Schedule)
        </h2>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
          📅 2026년 11월 의장대대 훈련 및 행사 캘린더 연동 완료 (일일 일정 실시간 표기 중)
        </div>
      </div>
    </div>
  );
}

function NoticeTab({ isLoggedIn }) {
  if (!isLoggedIn) return <LockedMessage />;
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-emerald-400 mb-3">📌 중요 공지</h3>
        <table className="w-full text-left text-xs mb-6">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr><th className="p-3">작성자</th><th className="p-3">제목</th><th className="p-3 text-right">작성일</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr><td className="p-3 text-emerald-300">대대장</td><td className="p-3">논산훈련소 통합 의장대 사열 규정 제정안 공고</td><td className="p-3 text-right text-slate-400">2026.11.15</td></tr>
          </tbody>
        </table>
        <h3 className="text-sm font-bold text-amber-400 mb-3">🎯 훈련 공지</h3>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr><th className="p-3">작성자</th><th className="p-3">제목</th><th className="p-3 text-right">작성일</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr><td className="p-3 text-amber-300">소대장</td><td className="p-3">집총 제식 및 대형 숙달 훈련 집결령</td><td className="p-3 text-right text-slate-400">2026.11.17</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventTab({ isLoggedIn }) {
  if (!isLoggedIn) return <LockedMessage />;
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-emerald-400 mb-3">🎭 행사 안내</h3>
        <table className="w-full text-left text-xs mb-6">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr><th className="p-3">작성자</th><th className="p-3">행사명</th><th className="p-3 text-right">일시</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr><td className="p-3 text-emerald-300">행정관</td><td className="p-3">육군본부 환영 의전 행사 지원</td><td className="p-3 text-right text-slate-400">2026.11.20</td></tr>
          </tbody>
        </table>
        <h3 className="text-sm font-bold text-blue-400 mb-3">📷 이전 행사 갤러리</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl h-32 flex items-center justify-center text-xs text-slate-500">
            업로드된 행사 사진 1
          </div>
        </div>
      </div>
    </div>
  );
}

function ApprovalTab({ isLoggedIn }) {
  if (!isLoggedIn) return <LockedMessage />;
  const [requestType, setRequestType] = useState('order');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('인가 요청이 성공적으로 접수되었습니다. 간부 승인 대기 중입니다.');
    setTitle(''); setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-emerald-400 mb-4">📝 인가 요청 시스템 (4분할)</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mb-8 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            {['order', 'discharge', 'leave', 'reward'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRequestType(type)}
                className={`py-2 text-xs rounded-lg font-bold uppercase transition ${
                  requestType === type ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {type === 'order' && '명령'}
                {type === 'discharge' && '전역·전출'}
                {type === 'leave' && '휴가'}
                {type === 'reward' && '포상'}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">제목 / 대상</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: [휴가] 개인 사유 정기 휴가 신청" 
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              required 
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">상세 내용 및 사유</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              placeholder="요청 사유 및 기간을 상세히 기재하세요." 
              rows="3"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-bold transition shadow">
            인가 요청서 제출
          </button>
        </form>
      </div>
    </div>
  );
}

function ReportTab({ isLoggedIn }) {
  if (!isLoggedIn) return <LockedMessage />;
  const [reportType, setReportType] = useState('duty');
  const [trainingKind, setTrainingKind] = useState('집총 제식');
  const [duration, setDuration] = useState(30);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-emerald-400 mb-4">📋 3대 보고서 작성</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setReportType('duty')} className={`px-4 py-2 text-xs rounded-lg font-bold ${reportType === 'duty' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'}`}>근무 (10분/1p)</button>
          <button onClick={() => setReportType('training')} className={`px-4 py-2 text-xs rounded-lg font-bold ${reportType === 'training' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'}`}>훈련 (10분/1~2p)</button>
          <button onClick={() => setReportType('exemplary')} className={`px-4 py-2 text-xs rounded-lg font-bold ${reportType === 'exemplary' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'}`}>모범</button>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 max-w-xl space-y-4">
          {reportType === 'training' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">훈련 종류 선택 (10종)</label>
              <select 
                value={trainingKind} 
                onChange={(e) => setTrainingKind(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100"
              >
                {[
                  '집총 제식', '집총 대형', '연병장 행군', '집총대 실전 연습', 
                  '호위대 동작 제식', '기수 동작 제식', '기수대 실전 연습', 
                  '육군본부 환영 의전', '차량 의전', '의전 실전 연습'
                ].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-400 mb-1">소요 시간 (분)</label>
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100" 
            />
            <p className="text-[11px] text-emerald-400 mt-1">✨ 예상 적립 포인트: {Math.floor(duration / 10)} 포인트</p>
          </div>
          <button onClick={() => alert('보고서가 제출되었습니다. 관리 패널 승인 시 포인트가 지급됩니다.')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-bold transition">
            보고서 제출
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentTab({ isLoggedIn }) {
  if (!isLoggedIn) return <LockedMessage />;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-base font-bold text-emerald-400 mb-4">📁 규정 및 교범 문서 아카이브</h2>
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
          <tr><th className="p-3">제작자</th><th className="p-3">문서 제목 / 링크</th><th className="p-3 text-right">등록일</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <tr><td className="p-3 text-emerald-300">대대본부</td><td className="p-3 text-blue-400 underline cursor-pointer">[교범] 제23대 국군의장대 표준 제식 매뉴얼 v1.2</td><td className="p-3 text-right text-slate-400">2026.11.10</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function AdminTab({ isLoggedIn, userRole }) {
  if (!isLoggedIn) return <LockedMessage />;
  // 간부 권한이 있는지 확인 (admin, mod, 대대/중대/소대본부)
  const hasAdminAccess = ['admin', 'mod', '대대본부 +', '중대본부 +', '소대본부 +'].includes(userRole);
  
  if (!hasAdminAccess) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
        <AlertTriangle size={48} className="mx-auto text-amber-400 mb-4" />
        <h2 className="text-base font-bold text-amber-400">접근 권한 없음</h2>
        <p className="text-xs text-slate-400 mt-2">관리 패널은 지휘관 및 간부(대대본부 이상)만 접근할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
        <Award size={18} /> 간부 및 소유자 관리 패널 (결재 시스템)
      </h2>
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 mb-3">📊 대기중인 보고서 및 인가 요청 처리</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-emerald-400 font-bold">[훈련]</span> 이병 홍길동 - 집총 제식 (30분)
            </div>
            <div className="flex gap-2">
              <button onClick={() => alert('승인되었습니다. 대원에게 포인트 3p가 지급되었습니다.')} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded text-white font-bold">처리/승인</button>
              <button onClick={() => alert('반려되었습니다.')} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white font-bold">반려</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyInfoTab({ isLoggedIn, myInfo }) {
  if (!isLoggedIn) return <LoginPrompt />;
  const percent = Math.min(100, (myInfo.points / myInfo.maxPoints) * 100);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <img src={myInfo.avatarUrl} alt="프로필" className="w-20 h-20 rounded-full border-2 border-emerald-500 object-cover shadow-lg" />
        <div>
          <h2 className="text-lg font-black text-white">{myInfo.robloxName}</h2>
          <p className="text-xs text-emerald-400 font-medium">계급: {myInfo.rank} | 직책: {myInfo.role}</p>
          <p className="text-xs text-slate-400 mt-1">부대 전입일: {myInfo.enlistDate} | 경고 횟수: {myInfo.warnings}회</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-300">진급 마일리지 포인트</span>
          <span className="text-emerald-400">{myInfo.points} / {myInfo.maxPoints} P</span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
        </div>
        <p className="text-[11px] text-slate-400 text-right">다음 계급 진급까지 남은 포인트: {Math.max(0, myInfo.maxPoints - myInfo.points)}p</p>
      </div>
    </div>
  );
}

function LoginPrompt() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
      <User size={48} className="mx-auto text-slate-600 mb-4" />
      <h2 className="text-base font-bold text-slate-400">로그인이 필요합니다</h2>
      <p className="text-xs text-slate-500 mt-2">상단 우측 버튼을 눌러 디스코드·로블록스 계정을 연동해 주세요.</p>
    </div>
  );
}

function LockedMessage() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
      <AlertTriangle size={48} className="mx-auto text-amber-400 mb-4" />
      <h2 className="text-base font-bold text-amber-400">페이지 잠김</h2>
      <p className="text-xs text-slate-400 mt-2">이 페이지를 보려면 먼저 로그인을 해야 합니다.</p>
    </div>
  );
}
