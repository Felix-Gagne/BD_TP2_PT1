using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using SussyKart_Partie1.Models;

namespace SussyKart_Partie1.Data
{
    public partial class TP2_SussyKartContext : DbContext
    {
        public TP2_SussyKartContext()
        {
        }

        public TP2_SussyKartContext(DbContextOptions<TP2_SussyKartContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Changelog> Changelogs { get; set; } = null!;
        public virtual DbSet<Course> Courses { get; set; } = null!;
        public virtual DbSet<ParticipationCourse> ParticipationCourses { get; set; } = null!;
        public virtual DbSet<Utilisateur> Utilisateurs { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=SussyKart");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Changelog>(entity =>
            {
                entity.Property(e => e.InstalledOn).HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<ParticipationCourse>(entity =>
            {
                entity.HasOne(d => d.Course)
                    .WithMany(p => p.ParticipationCourses)
                    .HasForeignKey(d => d.CourseId)
                    .HasConstraintName("FK_ParticipationCourse_CourseID");

                entity.HasOne(d => d.Utilisateur)
                    .WithMany(p => p.ParticipationCourses)
                    .HasForeignKey(d => d.UtilisateurId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ParticipationCourse_UtilisateurID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
