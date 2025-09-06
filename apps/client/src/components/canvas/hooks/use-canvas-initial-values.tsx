import { IEdge, INode, ISetInterview } from "../types/types";

export const useCanvasInitialValues = (nodes: ISetInterview[]) => {
  let transformedNodes: INode[] = [];
  let idCounter = 1;

  nodes.forEach((domainNode) => {
    transformedNodes.push({
      id: domainNode.id,
      type: "domainNode",
      data: { label: domainNode.title },
    });

    // Iterate through topics
    domainNode.topics.forEach((topic) => {
      transformedNodes.push({
        id: topic.id,
        type: "topicNode",
        data: { label: topic.title },
        coreTitle: domainNode.title,
      });

      // Iterate through themes
      topic.themes.forEach((theme) => {
        transformedNodes.push({
          id: theme.id,
          type: "themeNode",
          data: { label: theme.title },
          topicTitle: topic.title,
        });

        // Iterate through questions
        theme.questions.forEach((question) => {
          transformedNodes.push({
            id: question.id,
            type: "questionNode",
            data: {
              weight: question.weight || 0,
              tags: question.tags || [],
              label: question.title,
            },
            themeTitle: theme.title,
          });

          // Iterate through followUpQuestions
          question.followUpQuestions?.forEach((followUp) => {
            transformedNodes.push({
              id: followUp.id,
              type: "followUpNode",
              data: {
                weight: followUp.weight || 0,
                tags: followUp.tags || [],
                label: followUp.title,
              },
              questionTitle: question.title,
            });
          });
        });
      });
    });
  });

  let initialEdges: IEdge[] = [];
  let edgeCounter = 1;

  // Iterate through the nodes to create edges
  transformedNodes.forEach((node, index) => {
    if (node.type === "domainNode") {
      const domainNodeId = node.id;
      const domainTitle = node.data.label;

      transformedNodes.forEach((nextNode, index) => {
        if (
          nextNode.type === "topicNode" &&
          nextNode.coreTitle === domainTitle
        ) {
          // create an edge
          initialEdges.push({
            id: `db-e${edgeCounter++}-${index + 1}`,
            source: domainNodeId,
            target: nextNode.id,
          });
        }
      });
    }

    if (node.type === "topicNode") {
      const topicNodeId = node.id;
      const topicTitle = node.data.label;

      transformedNodes.forEach((nextNode, index) => {
        if (
          nextNode.type === "themeNode" &&
          nextNode.topicTitle === topicTitle
        ) {
          // create an edge
          initialEdges.push({
            id: `db-e${edgeCounter++}-${index + 1}`,
            source: topicNodeId,
            target: nextNode.id,
          });
        }
      });
    }

    if (node.type === "themeNode") {
      const themeNodeId = node.id;
      const themeTitle = node.data.label;

      transformedNodes.forEach((nextNode, index) => {
        if (
          nextNode.type === "questionNode" &&
          nextNode.themeTitle === themeTitle
        ) {
          // create an edge
          initialEdges.push({
            id: `db-e${idCounter++}-${index + 1}`,
            source: themeNodeId,
            target: nextNode.id,
          });
        }
      });
    }

    if (node.type === "questionNode") {
      const followUpNodeId = node.id;
      const followUpTitle = node.data.label;

      transformedNodes.forEach((nextNode, index) => {
        if (
          nextNode.type === "followUpNode" &&
          nextNode.questionTitle === followUpTitle
        ) {
          // create an edge
          initialEdges.push({
            id: `db-e${idCounter++}-${index + 1}`,
            source: followUpNodeId,
            target: nextNode.id,
          });
        }
      });
    }
  });

  return { transformedNodes, initialEdges };
};
