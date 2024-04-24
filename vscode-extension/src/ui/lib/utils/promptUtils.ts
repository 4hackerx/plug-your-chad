import { Context, User } from "src/shared/interface";

export function getPromptTemplate(
  user: User,
  context: Context,
  includeFileContent: boolean
): any {
  const { skillLevel, preferences } = user;
  let promptTemplate: any = {
    context: {
      codeSnippet: context.codeSnippet,
      fileLanguage: context.fileLanguage,
      startLine: context.startLine,
      startChar: context.startChar,
      endLine: context.endLine,
      endChar: context.endChar,
      codeExplanation: true,
      codeExamples: true,
      techTerminology: "explain",
    },
    user: {
      id: user.id,
      skillLevel: user.skillLevel,
      preferences: {
        verbosity: "medium",
        codeExplanation: true,
        codeExamples: true,
        techTerminology: "explain",
        responseFormat: "markdown",
        includeDiagrams: false,
        suggestOptimizations: true,
        provideFeedback: true,
      },
    },
    question: context.question,
    history: context.history || [],
  };

  if (includeFileContent && context.fileContent) {
    promptTemplate.context.fileContent = context.fileContent;
  }

  switch (skillLevel) {
    case "beginner":
      promptTemplate.context.codeExplanation = true;
      promptTemplate.context.codeExamples = true;
      promptTemplate.context.techTerminology = "explain";
      promptTemplate.user.preferences.verbosity = "high";
      break;
    case "intermediate":
      promptTemplate.context.codeExplanation = preferences.codeExplanation;
      promptTemplate.context.codeExamples = preferences.codeExamples;
      promptTemplate.context.techTerminology = preferences.techTerminology;
      promptTemplate.user.preferences.verbosity = preferences.verbosity;
      break;
    case "advanced":
      promptTemplate.context.codeExplanation = false;
      promptTemplate.context.codeExamples = false;
      promptTemplate.context.techTerminology = "use";
      promptTemplate.user.preferences.verbosity = "low";
      break;
    default:
      promptTemplate.context.codeExplanation = true;
      promptTemplate.context.codeExamples = true;
      promptTemplate.context.techTerminology = "explain";
      promptTemplate.user.preferences.verbosity = "medium";
  }

  if (preferences.codeExplanation !== undefined) {
    promptTemplate.context.codeExplanation = preferences.codeExplanation;
  }
  if (preferences.codeExamples !== undefined) {
    promptTemplate.context.codeExamples = preferences.codeExamples;
  }
  if (preferences.techTerminology) {
    promptTemplate.context.techTerminology = preferences.techTerminology;
  }
  if (preferences.verbosity) {
    promptTemplate.user.preferences.verbosity = preferences.verbosity;
  }
  if (preferences.responseFormat) {
    promptTemplate.user.preferences.responseFormat = preferences.responseFormat;
  }
  if (preferences.includeDiagrams !== undefined) {
    promptTemplate.user.preferences.includeDiagrams =
      preferences.includeDiagrams;
  }
  if (preferences.suggestOptimizations !== undefined) {
    promptTemplate.user.preferences.suggestOptimizations =
      preferences.suggestOptimizations;
  }
  if (preferences.provideFeedback !== undefined) {
    promptTemplate.user.preferences.provideFeedback =
      preferences.provideFeedback;
  }

  return promptTemplate;
}
