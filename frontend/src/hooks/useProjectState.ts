import {useEffect, useState} from "react";
import {Member, Payment, Project} from "../types";

export const useProjectState = (project: Project | undefined) => {

  const [updatedProjectPayments, setUpdatedProjectPayments] = useState<Payment[]>([]);
  const [originalProjectName, setOriginalProjectName] = useState<string>('');
  const [editedProjectName, setEditedProjectName] = useState<string>('');
  const [originalMembers, setOriginalMembers] = useState<Member[]>([]);
  const [updatedMembers, setUpdatedMembers] = useState<Member[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (project) {
      setOriginalProjectName(project.name || '');
      setEditedProjectName(project.name || '');
      setOriginalMembers(project.members || []);
      setUpdatedMembers(project.members || []);
      document.title = "tabsplid - " + (project.name || 'Untitled Project');
    }
  }, [project]);

  const detectChanges = () => {
    const projectNameChanged = originalProjectName !== editedProjectName;
    const membersChanged = JSON.stringify(originalMembers) !== JSON.stringify(updatedMembers);
    return {projectNameChanged, membersChanged};
  };

  return {
    updatedProjectPayments,
    setUpdatedProjectPayments,
    originalProjectName,
    setOriginalProjectName,
    editedProjectName,
    setEditedProjectName,
    originalMembers,
    setOriginalMembers,
    updatedMembers,
    setUpdatedMembers,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    detectChanges,
  };
};
