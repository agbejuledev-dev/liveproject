// @ts-nocheck

"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardCheck,
  FileText,
  Lock,
  Menu,
  PlayCircle,
  RotateCcw,
  StickyNote,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CourseIntroVideo from "@/components/CourseIntroVideo";

import { getCourse } from "@/lib/courses";
import {
  calculateLearningProgress,
  getAllLearningLessons,
  getCourseLearningContent,
  saveLearningProgress,
  type LearningLesson,
} from "@/lib/course-learning";
import { getUserSession } from "@/lib/project-access";

type LocalProgress = {
  completedLessonIds: string[];
  notes: Record<string, string>;
  quizScores: Record<string, number>;
  practicalScores: Record<string, number>;
  assessmentScore?: number;
  assessmentPassed?: boolean;
  lastLessonId?: string;
  startedAt?: string;
  completedAt?: string;
};

const emptyProgress: LocalProgress = {
  completedLessonIds: [],
  notes: {},
  quizScores: {},
  practicalScores: {},
};

function getProgressKey(courseId: string) {
  return `liveproject_course_progress_${courseId}`;
}

function getCourseAccessKey(courseId: string) {
  return `liveproject_course_access_${courseId}`;
}

function getSafeCourseTitle(course: any, courseId: string) {
  return (
    course?.title ||
    course?.name ||
    courseId ||
    ""
  );
}

function isPremiumUser() {
  return getUserSession()?.plan === "premium";
}

export default function CourseLearningPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();

  const courseId = params?.courseId;

  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);

  const [courseTitle, setCourseTitle] = useState("");
  const [progress, setProgress] =
    useState<LocalProgress>(emptyProgress);

  const [activeLessonId, setActiveLessonId] = useState("");

  const [openModules, setOpenModules] = useState<
    Record<string, boolean>
  >({});

  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const [note, setNote] = useState("");

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const [assessmentAnswers, setAssessmentAnswers] =
    useState<Record<string, number>>({});

  const [assessmentSubmitted, setAssessmentSubmitted] =
    useState(false);

  const [assessmentScore, setAssessmentScore] =
    useState<number | null>(null);

  const course = useMemo(() => {
    if (!courseId) return null;

    try {
      return getCourse(courseId);
    } catch {
      return null;
    }
  }, [courseId]);

  const resolvedCourseTitle = useMemo(() => {
    return getSafeCourseTitle(course, courseId);
  }, [course, courseId]);

  const learningContent = useMemo(() => {
    if (!resolvedCourseTitle) return null;

    return getCourseLearningContent(
      resolvedCourseTitle
    );
  }, [resolvedCourseTitle]);

  const allLessons = useMemo(() => {
    if (!learningContent) return [];

    return getAllLearningLessons(
      learningContent
    );
  }, [learningContent]);

  const learningStats = useMemo(() => {
    if (!learningContent) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
      };
    }

    return calculateLearningProgress(
      learningContent,
      progress as any
    );
  }, [learningContent, progress]);

  const finalAssessment =
    learningContent?.finalAssessment ?? null;

  const activeLesson = useMemo(() => {
    if (!activeLessonId) return null;

    return (
      allLessons.find(
        (lessonItem) =>
          lessonItem.id === activeLessonId
      ) ?? null
    );
  }, [activeLessonId, allLessons]);

  const activeIndex = activeLesson
    ? allLessons.findIndex(
        (lessonItem) =>
          lessonItem.id === activeLesson.id
      )
    : -1;

  const previousLesson =
    activeIndex > 0
      ? allLessons[activeIndex - 1]
      : null;

  const nextLesson =
    activeIndex >= 0 &&
    activeIndex < allLessons.length - 1
      ? allLessons[activeIndex + 1]
      : null;

  const modules =
    learningContent?.modules ?? [];

  useEffect(() => {
    if (!courseId || !course) {
      router.replace("/courses");
      return;
    }

    const session = getUserSession();

    if (!session?.loggedIn) {
      router.replace("/register");
      return;
    }

    const courseIsPremium =
      Boolean((course as any).premium) ||
      Boolean((course as any).isPremium);

    if (
      courseIsPremium &&
      session.plan !== "premium"
    ) {
      setLocked(true);
      setReady(true);
      return;
    }

    const accessKey =
      getCourseAccessKey(courseId);

    const previousAccess =
      localStorage.getItem(accessKey);

    if (
      session.plan !== "premium" &&
      !courseIsPremium &&
      !previousAccess
    ) {
      const existingStartedCourses: string[] =
        [];

      try {
        for (
          let index = 0;
          index < localStorage.length;
          index++
        ) {
          const key =
            localStorage.key(index);

          if (!key) continue;

          if (
            key.startsWith(
              "liveproject_course_progress_"
            )
          ) {
            const raw =
              localStorage.getItem(key);

            if (!raw) continue;

            const stored =
              JSON.parse(raw);

            if (
              stored?.startedAt ||
              stored?.completedLessonIds?.length
            ) {
              existingStartedCourses.push(
                key
              );
            }
          }
        }
      } catch {
        // Ignore malformed local storage entries.
      }

      if (
        existingStartedCourses.length >= 2
      ) {
        setLocked(true);
        setReady(true);
        return;
      }

      localStorage.setItem(
        accessKey,
        JSON.stringify({
          grantedAt:
            new Date().toISOString(),
          plan:
            session.plan ?? "free",
        })
      );
    }

    const progressKey =
      getProgressKey(courseId);

    let storedProgress: LocalProgress = {
      ...emptyProgress,
    };

    try {
      const raw =
        localStorage.getItem(
          progressKey
        );

      if (raw) {
        const parsed = JSON.parse(raw);

        storedProgress = {
          ...emptyProgress,
          ...parsed,
          completedLessonIds:
            Array.isArray(
              parsed?.completedLessonIds
            )
              ? parsed.completedLessonIds
              : [],
          notes:
            parsed?.notes &&
            typeof parsed.notes ===
              "object"
              ? parsed.notes
              : {},
          quizScores:
            parsed?.quizScores &&
            typeof parsed.quizScores ===
              "object"
              ? parsed.quizScores
              : {},
          practicalScores:
            parsed?.practicalScores &&
            typeof parsed
              .practicalScores === "object"
              ? parsed.practicalScores
              : {},
          assessmentScore:
            typeof parsed?.assessmentScore ===
            "number"
              ? parsed.assessmentScore
              : undefined,
          assessmentPassed:
            typeof parsed?.assessmentPassed ===
            "boolean"
              ? parsed.assessmentPassed
              : undefined,
          lastLessonId:
            typeof parsed?.lastLessonId ===
            "string"
              ? parsed.lastLessonId
              : undefined,
          startedAt:
            typeof parsed?.startedAt ===
            "string"
              ? parsed.startedAt
              : undefined,
          completedAt:
            typeof parsed?.completedAt ===
            "string"
              ? parsed.completedAt
              : undefined,
        };
      }
    } catch {
      storedProgress = {
        ...emptyProgress,
      };
    }

    const title =
      getSafeCourseTitle(
        course,
        courseId
      );

    setCourseTitle(title);
    setProgress(storedProgress);

    const lastLesson =
      storedProgress.lastLessonId
        ? allLessons.find(
            (lessonItem) =>
              lessonItem.id ===
              storedProgress.lastLessonId
          )
        : null;

    const firstAvailableLesson =
      allLessons.find(
        (lessonItem) =>
          !lessonItem.isPremium ||
          session.plan === "premium"
      ) ?? allLessons[0];

    setActiveLessonId(
      lastLesson?.id ??
        firstAvailableLesson?.id ??
        ""
    );

    const initialModules: Record<
      string,
      boolean
    > = {};

    modules.forEach((module) => {
      initialModules[module.id] = true;
    });

    setOpenModules(initialModules);

    setReady(true);
  }, [
    courseId,
    course,
    router,
    allLessons,
    modules,
  ]);

  useEffect(() => {
    if (!courseId || !ready) return;

    const key =
      getProgressKey(courseId);

    localStorage.setItem(
      key,
      JSON.stringify(progress)
    );

    saveLearningProgress(
      courseId,
      progress as any
    );
  }, [
    courseId,
    progress,
    ready,
  ]);

  useEffect(() => {
    if (!activeLessonId) return;

    setNote(
      progress.notes[activeLessonId] ??
        ""
    );

    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [
    activeLessonId,
    progress.notes,
  ]);

  function openPremium() {
    router.push(
      `/premium?from=${encodeURIComponent(
        `/courses/${courseId}/learn`
      )}`
    );
  }

  function selectLesson(
    lessonItem: LearningLesson
  ) {
    if (
      lessonItem.isPremium &&
      !isPremiumUser()
    ) {
      openPremium();
      return;
    }

    setActiveLessonId(
      lessonItem.id
    );

    setMobileSidebar(false);

    setProgress((current) => ({
      ...current,
      lastLessonId:
        lessonItem.id,
      startedAt:
        current.startedAt ??
        new Date().toISOString(),
    }));
  }

  function goToLesson(
    lessonItem: LearningLesson | null
  ) {
    if (!lessonItem) return;

    selectLesson(lessonItem);
  }

  function markComplete() {
    if (!activeLesson) return;

    setProgress((current) => {
      if (
        current.completedLessonIds.includes(
          activeLesson.id
        )
      ) {
        return current;
      }

      const completedLessonIds =
        Array.from(
          new Set([
            ...current.completedLessonIds,
            activeLesson.id,
          ])
        );

      const allLessonsCompleted =
        allLessons.length > 0 &&
        completedLessonIds.length >=
          allLessons.length;

      const assessmentPassed =
        current.assessmentPassed === true;

      const courseCompleted =
        allLessonsCompleted &&
        (!finalAssessment ||
          assessmentPassed);

      return {
        ...current,
        completedLessonIds,
        lastLessonId:
          activeLesson.id,
        startedAt:
          current.startedAt ??
          new Date().toISOString(),
        completedAt:
          courseCompleted
            ? current.completedAt ??
              new Date().toISOString()
            : current.completedAt,
      };
    });
  }

  function saveNote() {
    if (!activeLesson) return;

    setProgress((current) => ({
      ...current,
      notes: {
        ...current.notes,
        [activeLesson.id]:
          note,
      },
    }));
  }

  function submitQuiz() {
    if (
      !activeLesson?.quiz?.length
    ) {
      return;
    }

    const total =
      activeLesson.quiz.length;

    const correct =
      activeLesson.quiz.reduce(
        (count, question) =>
          count +
          (selectedAnswers[
            question.id
          ] === question.answer
            ? 1
            : 0),
        0
      );

    const score =
      Math.round(
        (correct / total) * 100
      );

    setQuizScore(score);
    setQuizSubmitted(true);

    setProgress((current) => {
      const next = {
        ...current,
        quizScores: {
          ...current.quizScores,
          [activeLesson.id]:
            score,
        },
      };

      if (
        score >= 70 &&
        !current.completedLessonIds.includes(
          activeLesson.id
        )
      ) {
        next.completedLessonIds =
          Array.from(
            new Set([
              ...current.completedLessonIds,
              activeLesson.id,
            ])
          );

        next.lastLessonId =
          activeLesson.id;

        next.startedAt =
          current.startedAt ??
          new Date().toISOString();
      }

      return next;
    });
  }

  function submitAssessment() {
    if (!finalAssessment) return;

    const questions =
      finalAssessment.questions ?? [];

    if (!questions.length) return;

    const correct =
      questions.reduce(
        (count, question) =>
          count +
          (assessmentAnswers[
            question.id
          ] === question.answer
            ? 1
            : 0),
        0
      );

    const score =
      Math.round(
        (correct /
          questions.length) *
          100
      );

    const passed =
      score >= 70;

    setAssessmentScore(score);
    setAssessmentSubmitted(true);

    setProgress((current) => {
      const nextProgress = {
        ...current,
        assessmentScore: score,
        assessmentPassed:
          passed,
      };

      if (
        passed &&
        allLessons.length > 0 &&
        current.completedLessonIds.length >=
          allLessons.length
      ) {
        nextProgress.completedAt =
          current.completedAt ??
          new Date().toISOString();
      }

      return nextProgress;
    });
  }

  function resetQuiz() {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  }

  function toggleModule(
    moduleId: string
  ) {
    setOpenModules((current) => ({
      ...current,
      [moduleId]:
        !current[moduleId],
    }));
  }

  function isLessonCompleted(
    lessonId: string
  ) {
    return progress.completedLessonIds.includes(
      lessonId
    );
  }

  function openAssessment() {
    setActiveLessonId(
      "__final_assessment__"
    );
    setMobileSidebar(false);
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Loading your course...
        </div>
      </main>
    );
  }

  if (locked) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Lock size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-slate-950">
            Premium learning access
          </h1>

          <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
            This course or your Free
            learning capacity is
            currently locked. Upgrade
            to Premium to unlock the
            complete learning
            experience.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={openPremium}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Upgrade to Premium
            </button>

            <button
              onClick={() =>
                router.push(
                  "/courses"
                )
              }
              className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!learningContent) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <BookOpen
            className="mx-auto text-slate-400"
            size={40}
          />

          <h1 className="mt-5 text-2xl font-black">
            Course content unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            We couldn't load the
            learning content for this
            course.
          </p>

          <button
            onClick={() =>
              router.push(
                "/courses"
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            Back to Courses
          </button>
        </div>
      </main>
    );
  }

  const courseCompleted =
    Boolean(progress.completedAt);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() =>
                router.push(
                  `/courses/${courseId}`
                )
              }
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Back to course"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {courseTitle}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 sm:w-40">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${learningStats.percentage}%`,
                    }}
                  />
                </div>

                <span className="text-[11px] font-semibold text-slate-500">
                  {learningStats.percentage}%
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              setMobileSidebar(true)
            }
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-[330px] shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Course Content
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {learningStats.completed}{" "}
                    of{" "}
                    {learningStats.total}{" "}
                    lessons
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-blue-100 text-xs font-bold text-blue-600">
                  {learningStats.percentage}%
                </div>
              </div>
            </div>

            <LessonSidebar
              modules={modules}
              activeLessonId={
                activeLessonId
              }
              openModules={
                openModules
              }
              completedLessonIds={
                progress.completedLessonIds
              }
              onToggleModule={
                toggleModule
              }
              onSelectLesson={
                selectLesson
              }
            />

            {finalAssessment && (
              <div className="border-t border-slate-200 p-4">
                <button
                  onClick={
                    openAssessment
                  }
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                    activeLessonId ===
                    "__final_assessment__"
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <ClipboardCheck size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold">
                      Final Assessment
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {progress.assessmentPassed
                        ? "Passed"
                        : "Required for completion"}
                    </p>
                  </div>

                  {progress.assessmentPassed && (
                    <CheckCircle2
                      size={16}
                      className="ml-auto text-emerald-600"
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </aside>

        {mobileSidebar && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              className="absolute inset-0 bg-slate-950/40"
              onClick={() =>
                setMobileSidebar(false)
              }
              aria-label="Close menu"
            />

            <aside className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-white shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <div>
                  <p className="text-sm font-bold">
                    Course Content
                  </p>

                  <p className="text-xs text-slate-500">
                    {learningStats.percentage}%
                    complete
                  </p>
                </div>

                <button
                  onClick={() =>
                    setMobileSidebar(false)
                  }
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={19} />
                </button>
              </div>

              <LessonSidebar
                modules={modules}
                activeLessonId={
                  activeLessonId
                }
                openModules={
                  openModules
                }
                completedLessonIds={
                  progress.completedLessonIds
                }
                onToggleModule={
                  toggleModule
                }
                onSelectLesson={
                  selectLesson
                }
              />

              {finalAssessment && (
                <div className="border-t border-slate-200 p-4">
                  <button
                    onClick={
                      openAssessment
                    }
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50"
                  >
                    <ClipboardCheck
                      size={18}
                      className="text-amber-600"
                    />

                    <span className="text-sm font-bold">
                      Final Assessment
                    </span>
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}

        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
            {activeLessonId !== "__final_assessment__" && (
              <div className="mb-8">
                <CourseIntroVideo
                  title={courseTitle}
                  description={`Take a short introduction to ${courseTitle} before you continue. Learn what the course covers, what you will gain, and how the skills can benefit your career.`}
                  videoUrl={(course as any)?.introVideoUrl}
                  posterUrl={(course as any)?.introVideoPoster}
                />
              </div>
            )}

            {activeLessonId ===
            "__final_assessment__" ? (
              <FinalAssessment
                assessment={
                  finalAssessment
                }
                answers={
                  assessmentAnswers
                }
                submitted={
                  assessmentSubmitted
                }
                score={
                  assessmentScore
                }
                onAnswer={(
                  questionId,
                  answer
                ) =>
                  setAssessmentAnswers(
                    (current) => ({
                      ...current,
                      [questionId]:
                        answer,
                    })
                  )
                }
                onSubmit={
                  submitAssessment
                }
                onReset={() => {
                  setAssessmentAnswers(
                    {}
                  );
                  setAssessmentSubmitted(
                    false
                  );
                  setAssessmentScore(
                    null
                  );
                }}
                passed={
                  progress.assessmentPassed ===
                  true
                }
              />
            ) : activeLesson ? (
              <>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                      {activeLesson.type ||
                        "Lesson"}
                    </span>

                    {activeLesson.isPremium && (
                      <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        PREMIUM
                      </span>
                    )}

                    {isLessonCompleted(
                      activeLesson.id
                    ) && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 size={12} />
                        COMPLETED
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                    {activeLesson.title}
                  </h1>

                  {activeLesson.description && (
                    <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                      {activeLesson.description}
                    </p>
                  )}
                </div>

                {activeLesson.videoUrl ? (
                  <div className="mt-8 overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
                    <video
                      className="aspect-video w-full"
                      controls
                      src={
                        activeLesson.videoUrl
                      }
                      poster={
                        activeLesson.videoPoster
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-8 overflow-hidden rounded-2xl bg-slate-950">
                    <div className="flex aspect-video flex-col items-center justify-center px-6 text-center text-white">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <PlayCircle size={30} />
                      </div>

                      <p className="mt-4 text-sm font-bold">
                        Lesson video
                      </p>

                      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                        Video content can
                        be connected here
                        when the course
                        recordings are
                        ready.
                      </p>
                    </div>
                  </div>
                )}

                {activeLesson.content && (
                  <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div
                      className="prose prose-slate max-w-none prose-headings:font-black prose-h2:mt-8 prose-h2:text-xl prose-p:leading-8 prose-li:leading-7"
                      dangerouslySetInnerHTML={{
                        __html:
                          activeLesson.content,
                      }}
                    />
                  </article>
                )}

                {activeLesson.resources &&
                  activeLesson.resources
                    .length > 0 && (
                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <FileText size={18} />
                        </div>

                        <div>
                          <h2 className="font-bold">
                            Resources
                          </h2>

                          <p className="text-xs text-slate-500">
                            Helpful material
                            for this lesson
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        {activeLesson.resources.map(
                          (
                            resource,
                            resourceIndex
                          ) => (
                            <a
                              key={`${resource.id ?? resource.title ?? "resource"}-${resourceIndex}`}
                              href={
                                resource.url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
                            >
                              <div className="flex items-center gap-3">
                                <FileText
                                  size={17}
                                  className="text-blue-600"
                                />

                                <span className="text-sm font-semibold">
                                  {
                                    resource.title
                                  }
                                </span>
                              </div>

                              <ArrowRight
                                size={16}
                                className="text-slate-400"
                              />
                            </a>
                          )
                        )}
                      </div>
                    </section>
                  )}

                {activeLesson.practical && (
                  <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <Target size={18} />
                      </div>

                      <div>
                        <h2 className="font-bold">
                          Practical Exercise
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {
                            activeLesson
                              .practical
                              .title
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-blue-100 bg-white p-5">
                      <p className="text-sm leading-7 text-slate-600">
                        {Array.isArray(
                          activeLesson
                            .practical
                            .instructions
                        )
                          ? activeLesson.practical.instructions.join(
                              " "
                            )
                          : activeLesson
                              .practical
                              .instructions}
                      </p>

                      {activeLesson.practical.requirements &&
                        activeLesson.practical
                          .requirements
                          .length > 0 && (
                          <ul className="mt-4 space-y-2">
                            {activeLesson.practical.requirements.map(
                              (
                                requirement,
                                index
                              ) => (
                                <li
                                  key={`${requirement}-${index}`}
                                  className="flex gap-2 text-sm leading-6 text-slate-600"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                  {
                                    requirement
                                  }
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </div>
                  </section>
                )}

                {activeLesson.quiz &&
                  activeLesson.quiz.length >
                    0 && (
                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <ClipboardCheck size={18} />
                          </div>

                          <div>
                            <h2 className="font-bold">
                              Knowledge Check
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Score at
                              least 70%
                              to complete
                              this lesson.
                            </p>
                          </div>
                        </div>

                        {quizSubmitted && (
                          <span
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                              (quizScore ??
                                0) >= 70
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {quizScore}%
                          </span>
                        )}
                      </div>

                      <div className="mt-7 space-y-7">
                        {activeLesson.quiz.map(
                          (
                            question,
                            questionIndex
                          ) => (
                            <div
                              key={
                                question.id
                              }
                            >
                              <p className="text-sm font-bold leading-6">
                                {questionIndex +
                                  1}
                                .{" "}
                                {
                                  question.question
                                }
                              </p>

                              <div className="mt-3 space-y-2">
                                {question.options.map(
                                  (
                                    option,
                                    optionIndex
                                  ) => {
                                    const selected =
                                      selectedAnswers[
                                        question.id
                                      ] ===
                                      optionIndex;

                                    const correct =
                                      quizSubmitted &&
                                      question.answer ===
                                        optionIndex;

                                    const incorrect =
                                      quizSubmitted &&
                                      selected &&
                                      !correct;

                                    return (
                                      <button
                                        key={`${question.id}-option-${optionIndex}`}
                                        onClick={() =>
                                          !quizSubmitted &&
                                          setSelectedAnswers(
                                            (
                                              current
                                            ) => ({
                                              ...current,
                                              [question.id]:
                                                optionIndex,
                                            })
                                          )
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                                          correct
                                            ? "border-emerald-300 bg-emerald-50"
                                            : incorrect
                                              ? "border-red-300 bg-red-50"
                                              : selected
                                                ? "border-blue-300 bg-blue-50"
                                                : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                                        }`}
                                      >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold">
                                          {String.fromCharCode(
                                            65 +
                                              optionIndex
                                          )}
                                        </span>

                                        <span className="font-medium">
                                          {
                                            option
                                          }
                                        </span>

                                        {correct && (
                                          <CheckCircle2
                                            size={17}
                                            className="ml-auto text-emerald-600"
                                          />
                                        )}
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-7 flex flex-wrap gap-3">
                        {!quizSubmitted ? (
                          <button
                            onClick={
                              submitQuiz
                            }
                            disabled={
                              Object.keys(
                                selectedAnswers
                              ).length !==
                              activeLesson.quiz
                                .length
                            }
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Submit Quiz
                          </button>
                        ) : (
                          <>
                            {(quizScore ??
                              0) >= 70 ? (
                              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700">
                                <CheckCircle2 size={17} />
                                Lesson completed
                              </span>
                            ) : (
                              <button
                                onClick={
                                  resetQuiz
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
                              >
                                <RotateCcw size={16} />
                                Try Again
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </section>
                  )}

                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button
                    onClick={() =>
                      setShowNotes(
                        (value) =>
                          !value
                      )
                    }
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <StickyNote size={18} />
                      </div>

                      <div>
                        <h2 className="font-bold">
                          My Notes
                        </h2>

                        <p className="text-xs text-slate-500">
                          Save personal
                          notes for this
                          lesson
                        </p>
                      </div>
                    </div>

                    {showNotes ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  {showNotes && (
                    <div className="border-t border-slate-100 p-5">
                      <textarea
                        value={note}
                        onChange={(event) =>
                          setNote(
                            event.target
                              .value
                          )
                        }
                        placeholder="Write something you want to remember..."
                        className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                      />

                      <button
                        onClick={
                          saveNote
                        }
                        className="mt-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
                      >
                        Save Note
                      </button>
                    </div>
                  )}
                </section>

                {!activeLesson.quiz?.length &&
                  !isLessonCompleted(
                    activeLesson.id
                  ) && (
                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-bold">
                            Finished this
                            lesson?
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Mark it
                            complete when
                            you've
                            finished the
                            lesson
                            material.
                          </p>
                        </div>

                        <button
                          onClick={
                            markComplete
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
                        >
                          <CheckCircle2 size={17} />
                          Mark Complete
                        </button>
                      </div>
                    </section>
                  )}

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() =>
                      goToLesson(
                        previousLesson
                      )
                    }
                    disabled={
                      !previousLesson
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={17} />
                    Previous
                  </button>

                  {nextLesson ? (
                    <button
                      onClick={() =>
                        goToLesson(
                          nextLesson
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
                    >
                      Next Lesson
                      <ArrowRight size={17} />
                    </button>
                  ) : finalAssessment ? (
                    <button
                      onClick={
                        openAssessment
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
                    >
                      Final Assessment
                      <ArrowRight size={17} />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        router.push(
                          `/courses/${courseId}`
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
                    >
                      Finish Course
                      <Trophy size={17} />
                    </button>
                  )}
                </div>

                {courseCompleted && (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600">
                      <Trophy size={22} />
                    </div>

                    <h2 className="mt-4 text-lg font-black text-emerald-900">
                      Course completed 🎉
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-emerald-800/80">
                      You've completed the
                      required learning
                      activities for this
                      course.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          `/courses/${courseId}`
                        )
                      }
                      className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"
                    >
                      Back to Course
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <BookOpen
                  size={35}
                  className="mx-auto text-slate-400"
                />

                <h1 className="mt-5 text-xl font-black">
                  Select a lesson
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Choose a lesson from the
                  course curriculum to begin
                  learning.
                </p>

                <button
                  onClick={() =>
                    setMobileSidebar(
                      true
                    )
                  }
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white lg:hidden"
                >
                  Open Course Content
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function LessonSidebar({
  modules,
  activeLessonId,
  openModules,
  completedLessonIds,
  onToggleModule,
  onSelectLesson,
}: {
  modules: any[];
  activeLessonId: string;
  openModules: Record<string, boolean>;
  completedLessonIds: string[];
  onToggleModule: (id: string) => void;
  onSelectLesson: (
    lesson: LearningLesson
  ) => void;
}) {
  return (
    <div className="p-3">
      {modules.map(
        (module, moduleIndex) => {
          const lessons =
            Array.isArray(
              module?.lessons
            )
              ? module.lessons
              : [];

          const moduleCompleted =
            lessons.length > 0 &&
            lessons.every(
              (
                lesson: LearningLesson
              ) =>
                completedLessonIds.includes(
                  lesson.id
                )
            );

          return (
            <div
              key={
                module?.id ??
                `module-${moduleIndex}`
              }
              className="mb-2 overflow-hidden rounded-xl border border-slate-100"
            >
              <button
                onClick={() =>
                  onToggleModule(
                    module.id
                  )
                }
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600">
                  {module.order ??
                    moduleIndex +
                      1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-5 text-slate-800">
                    {module.title}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {lessons.length}{" "}
                    {lessons.length ===
                    1
                      ? "lesson"
                      : "lessons"}
                  </p>
                </div>

                {moduleCompleted ? (
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-emerald-600"
                  />
                ) : openModules[
                    module.id
                  ] ? (
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-slate-400"
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-slate-400"
                  />
                )}
              </button>

              {openModules[
                module.id
              ] && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-2">
                  {lessons.map(
                    (
                      lesson: LearningLesson,
                      lessonIndex: number
                    ) => {
                      const completed =
                        completedLessonIds.includes(
                          lesson.id
                        );

                      const active =
                        activeLessonId ===
                        lesson.id;

                      const locked =
                        lesson.isPremium &&
                        !isPremiumUser();

                      return (
                        <button
                          key={
                            lesson?.id ??
                            `${module.id}-lesson-${lessonIndex}`
                          }
                          onClick={() =>
                            onSelectLesson(
                              lesson
                            )
                          }
                          className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                            active
                              ? "bg-blue-600 text-white"
                              : "text-slate-600 hover:bg-white"
                          }`}
                        >
                          <div className="shrink-0">
                            {completed ? (
                              <CheckCircle2
                                size={16}
                                className={
                                  active
                                    ? "text-white"
                                    : "text-emerald-600"
                                }
                              />
                            ) : locked ? (
                              <Lock
                                size={15}
                                className={
                                  active
                                    ? "text-white"
                                    : "text-amber-500"
                                }
                              />
                            ) : (
                              <Circle
                                size={15}
                                className={
                                  active
                                    ? "text-white"
                                    : "text-slate-300"
                                }
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold leading-5">
                              {lesson.title}
                            </p>

                            <p
                              className={`mt-0.5 text-[9px] ${
                                active
                                  ? "text-blue-100"
                                  : "text-slate-400"
                              }`}
                            >
                              {lesson.type ||
                                "Lesson"}
                              {locked
                                ? " • Premium"
                                : ""}
                            </p>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  );
}

function FinalAssessment({
  assessment,
  answers,
  submitted,
  score,
  onAnswer,
  onSubmit,
  onReset,
  passed,
}: {
  assessment: any;
  answers: Record<string, number>;
  submitted: boolean;
  score: number | null;
  onAnswer: (
    questionId: string,
    answer: number
  ) => void;
  onSubmit: () => void;
  onReset: () => void;
  passed: boolean;
}) {
  if (!assessment) return null;

  const questions =
    Array.isArray(
      assessment.questions
    )
      ? assessment.questions
      : [];

  const answeredCount =
    Object.keys(answers).length;

  return (
    <div>
      <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
          <ClipboardCheck size={23} />
        </div>

        <h1 className="mt-6 text-2xl font-black sm:text-3xl">
          Final Assessment
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Demonstrate what you've learned
          across the course. You need at
          least 70% to pass.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold">
            {questions.length} questions
          </span>

          <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold">
            Pass mark: 70%
          </span>

          <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold">
            {answeredCount}/
            {questions.length} answered
          </span>
        </div>
      </div>

      {submitted && (
        <div
          className={`mt-6 rounded-2xl border p-6 ${
            passed
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                passed
                  ? "bg-white text-emerald-600"
                  : "bg-white text-red-600"
              }`}
            >
              {passed ? (
                <Trophy size={22} />
              ) : (
                <RotateCcw size={21} />
              )}
            </div>

            <div>
              <p
                className={`font-black ${
                  passed
                    ? "text-emerald-900"
                    : "text-red-900"
                }`}
              >
                {passed
                  ? "Assessment passed!"
                  : "Assessment not passed"}
              </p>

              <p
                className={`mt-1 text-sm ${
                  passed
                    ? "text-emerald-800"
                    : "text-red-800"
                }`}
              >
                Your score:{" "}
                <strong>
                  {score ?? 0}%
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 space-y-6">
        {questions.map(
          (
            question: any,
            index: number
          ) => (
            <div
              key={
                question?.id ??
                `assessment-question-${index}`
              }
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="font-bold leading-7">
                {index + 1}.{" "}
                {question.question}
              </p>

              <div className="mt-4 space-y-2">
                {(
                  question.options ??
                  []
                ).map(
                  (
                    option: string,
                    optionIndex: number
                  ) => {
                    const selected =
                      answers[
                        question.id
                      ] ===
                      optionIndex;

                    const correct =
                      submitted &&
                      question.answer ===
                        optionIndex;

                    const wrong =
                      submitted &&
                      selected &&
                      !correct;

                    return (
                      <button
                        key={`${question.id ?? index}-option-${optionIndex}`}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          onAnswer(
                            question.id,
                            optionIndex
                          )
                        }
                        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                          correct
                            ? "border-emerald-300 bg-emerald-50"
                            : wrong
                              ? "border-red-300 bg-red-50"
                              : selected
                                ? "border-blue-300 bg-blue-50"
                                : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                          {String.fromCharCode(
                            65 +
                              optionIndex
                          )}
                        </span>

                        <span className="font-medium">
                          {option}
                        </span>

                        {correct && (
                          <CheckCircle2
                            size={17}
                            className="ml-auto text-emerald-600"
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {!submitted ? (
          <button
            onClick={onSubmit}
            disabled={
              questions.length === 0 ||
              answeredCount !==
                questions.length
            }
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit Final Assessment
          </button>
        ) : !passed ? (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700"
          >
            <RotateCcw size={16} />
            Retake Assessment
          </button>
        ) : null}
      </div>
    </div>
  );
}