import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Trash2, Eye } from "lucide-react";
import { Link } from "wouter";

interface WorkflowHistory {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  generatedCode: string | null;
}

export default function History() {
  const { data: workflows, isLoading } = useQuery<WorkflowHistory[]>({
    queryKey: ["/api/workflows"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Workflows</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your saved workflows
            </p>
          </div>
          <Link href="/">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </Link>
        </div>

        {!workflows || workflows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first workflow to see it appear here
              </p>
              <Link href="/">
                <Button>Get Started</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{workflow.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {workflow.description}
                      </p>
                    </div>
                    <Badge variant={workflow.status === "completed" ? "default" : "secondary"}>
                      {workflow.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href="/">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}