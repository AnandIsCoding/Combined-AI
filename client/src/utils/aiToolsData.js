import {
    FileText,
    Type,
    Image,
    Eraser,
    UserCheck,
    Scissors
} from 'lucide-react';

export const AiToolsData = [
    {
        title: 'AI Article Writer',
        description: 'Generate high-quality articles on any topic using AI.',
        icon: <FileText size={24} />,
        bg: { from: '#3588F2', to: '#0BB0D7' },
        path: '/ai/write-article'
    },
    {
        title: 'Blog Title Generator',
        description: 'Create catchy blog titles instantly with AI suggestions.',
        icon: <Type size={24} />,
        bg: { from: '#F7971E', to: '#FFD200' },
        path: '/ai/blog-title-generator'
    },
    {
        title: 'AI Image Generator',
        description: 'Generate unique images from text prompts using AI.',
        icon: <Image size={24} />,
        bg: { from: '#43CEA2', to: '#185A9D' },
        path: '/ai/image-generator'
    },
    {
        title: 'Background Removal',
        description: 'Remove image backgrounds automatically with AI.',
        icon: <Scissors size={24} />,
        bg: { from: '#FF512F', to: '#DD2476' },
        path: '/ai/remove-background'
    },
    {
        title: 'Object Removal',
        description: 'Erase unwanted objects from your photos using AI.',
        icon: <Eraser size={24} />,
        bg: { from: '#1D976C', to: '#93F9B9' },
        path: '/ai/remove-object'
    },
    {
        title: 'Resume Reviewer',
        description: 'Get instant feedback and suggestions for your resume.',
        icon: <UserCheck size={24} />,
        bg: { from: '#8360C3', to: '#2EBF91' },
        path: '/ai/review-resume'
    }]

export default AiToolsData;