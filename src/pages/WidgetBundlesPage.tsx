// Widget Bundles Page Component

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useWidgetBundles, useDeleteWidgetBundle } from '../hooks/useWidgetBundles';
import WidgetBundleForm from '../components/widget-bundle/WidgetBundleForm';

const WidgetBundlesPage: React.FC = () => {
  const { data: bundles, isLoading, error } = useWidgetBundles();
  const deleteMutation = useDeleteWidgetBundle();
  const [openForm, setOpenForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; bundle: any }>({
    open: false,
    bundle: null,
  });

  const handleAdd = () => {
    setEditingBundle(null);
    setOpenForm(true);
  };

  const handleEdit = (bundle: any) => {
    setEditingBundle(bundle);
    setOpenForm(true);
  };

  const handleDelete = (bundle: any) => {
    setDeleteConfirm({ open: true, bundle });
  };

  const confirmDelete = () => {
    if (deleteConfirm.bundle) {
      deleteMutation.mutate(deleteConfirm.bundle.id.id, {
        onSuccess: () => {
          setDeleteConfirm({ open: false, bundle: null });
        },
      });
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingBundle(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load widget bundles. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Widget Bundles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Widget Bundle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Alias</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bundles?.map((bundle) => (
              <TableRow
                key={bundle.id.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => window.location.href = `/widget-bundles/${bundle.id.id}`}
              >
                <TableCell>{bundle.title}</TableCell>
                <TableCell>{bundle.alias}</TableCell>
                <TableCell>
                  <Chip
                    label={bundle.tenantId.id === '13814000-1dd2-11b2-8080-808080808080' ? 'System' : 'Tenant'}
                    size="small"
                    color={bundle.tenantId.id === '13814000-1dd2-11b2-8080-808080808080' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>{bundle.description || '-'}</TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(bundle)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(bundle)}
                    aria-label="delete"
                    disabled={bundle.tenantId.id === '13814000-1dd2-11b2-8080-808080808080'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <WidgetBundleForm
        open={openForm}
        bundle={editingBundle}
        onClose={handleCloseForm}
      />

      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, bundle: null })}
      >
        <DialogTitle>Delete Widget Bundle</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteConfirm.bundle?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, bundle: null })}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
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

export default WidgetBundlesPage;

