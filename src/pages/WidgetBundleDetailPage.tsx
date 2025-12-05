// Widget Bundle Detail Page Component

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ImportExport as ImportExportIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  useWidgetBundle,
  useDeleteWidgetBundle,
  useBundleWidgetTypes,
} from '../hooks/useWidgetBundles';
import { useUpdateWidgetsBundleWidgetFqns } from '../hooks/useWidgetBundles';
import WidgetBundleForm from '../components/widget-bundle/WidgetBundleForm';
import WidgetTypeSelector from '../components/widget-bundle/WidgetTypeSelector';
import WidgetBundleImportExport from '../components/widget-bundle/WidgetBundleImportExport';

const WidgetBundleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bundle, isLoading: bundleLoading } = useWidgetBundle(id || '');
  const { data: widgetTypes, isLoading: typesLoading } = useBundleWidgetTypes(id || '');
  const deleteMutation = useDeleteWidgetBundle();
  const updateWidgetTypesMutation = useUpdateWidgetsBundleWidgetFqns();

  const [editOpen, setEditOpen] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  React.useEffect(() => {
    if (widgetTypes) {
      setSelectedTypes(widgetTypes.map((wt: any) => wt.fqn));
    }
  }, [widgetTypes]);

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          navigate('/widget-bundles');
        },
      });
    }
  };

  const handleUpdateWidgetTypes = () => {
    if (id) {
      updateWidgetTypesMutation.mutate(
        { bundleId: id, widgetTypeFqns: selectedTypes },
        {
          onSuccess: () => {
            // Refresh widget types
          },
        }
      );
    }
  };

  if (bundleLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!bundle) {
    return (
      <Alert severity="error">Widget bundle not found</Alert>
    );
  }

  const isSystemBundle = bundle.tenantId.id === '13814000-1dd2-11b2-8080-808080808080';

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/widget-bundles')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {bundle.title}
        </Typography>
        <Button
          startIcon={<EditIcon />}
          onClick={() => setEditOpen(true)}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button
          startIcon={<ImportExportIcon />}
          onClick={() => setImportExportOpen(true)}
          sx={{ mr: 1 }}
        >
          Import/Export
        </Button>
        {!isSystemBundle && (
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={() => setDeleteConfirm(true)}
          >
            Delete
          </Button>
        )}
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bundle Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Alias
              </Typography>
              <Typography variant="body1" gutterBottom>
                {bundle.alias}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Type
              </Typography>
              <Chip
                label={isSystemBundle ? 'System' : 'Tenant'}
                size="small"
                color={isSystemBundle ? 'primary' : 'default'}
                sx={{ mt: 0.5 }}
              />
            </Box>
            {bundle.description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {bundle.description}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '67%' } }}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Widget Types ({widgetTypes?.length || 0})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleUpdateWidgetTypes}
                disabled={updateWidgetTypesMutation.isPending}
              >
                {updateWidgetTypesMutation.isPending ? 'Updating...' : 'Update Types'}
              </Button>
            </Box>

            {typesLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <WidgetTypeSelector
                  bundleId={id}
                  selectedTypes={selectedTypes}
                  onSelectionChange={setSelectedTypes}
                />
                {widgetTypes && widgetTypes.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current Widget Types:
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
                      {widgetTypes.map((wt: any) => (
                        <Box key={wt.fqn} sx={{ minWidth: 200, flex: '1 1 30%' }}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="body2" fontWeight="bold">
                                {wt.name || wt.fqn}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {wt.fqn}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </Stack>

      <WidgetBundleForm
        open={editOpen}
        bundle={bundle}
        onClose={() => setEditOpen(false)}
      />

      <WidgetBundleImportExport
        open={importExportOpen}
        onClose={() => setImportExportOpen(false)}
        bundleId={id}
      />

      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Delete Widget Bundle</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{bundle.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WidgetBundleDetailPage;

