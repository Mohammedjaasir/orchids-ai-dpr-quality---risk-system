export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'reviewer'
  created_at: string
  updated_at: string
}

export interface DPR {
  id: string
  title: string
  project_name: string
  description: string | null
  file_url: string
  file_name: string
  file_type: string
  extracted_text: string | null
  uploaded_by: string | null
  status: 'pending' | 'analyzing' | 'reviewed' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  profiles?: Profile
  assessments?: Assessment[]
}

export interface Assessment {
  id: string
  dpr_id: string
  quality_score: number
  delay_risk: 'low' | 'medium' | 'high'
  cost_overrun_risk: 'low' | 'medium' | 'high'
  implementation_risk: 'low' | 'medium' | 'high'
  missing_sections: string[]
  weak_sections: string[]
  ai_explanation: string | null
  recommendation: 'approve' | 'reject' | 'revise' | null
  reviewed_by: string | null
  final_decision: 'approved' | 'rejected' | 'pending_revision' | null
  reviewer_comments: string | null
  created_at: string
  updated_at: string
}

export interface AnalysisResult {
  quality_score: number
  delay_risk: 'low' | 'medium' | 'high'
  cost_overrun_risk: 'low' | 'medium' | 'high'
  implementation_risk: 'low' | 'medium' | 'high'
  missing_sections: string[]
  weak_sections: string[]
  ai_explanation: string
  recommendation: 'approve' | 'reject' | 'revise'
}
