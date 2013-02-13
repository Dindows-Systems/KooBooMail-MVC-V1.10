---------------------------------------------------------
-- Create tables
---------------------------------------------------------

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Bounce]') AND type in (N'U'))
BEGIN
CREATE TABLE [Bounce](
	[Id] [uniqueidentifier] NOT NULL,
	[PopMessageId] [varchar](1024) NULL,
	[MessageId] [uniqueidentifier] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[EventTime] [datetime] NOT NULL,
	[MessageType] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
 CONSTRAINT [PK_BOUNCE] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Campaign]') AND type in (N'U'))
BEGIN
CREATE TABLE [Campaign](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[Name] [nvarchar](255) NULL,
	[SendingMode] [int] NOT NULL,
	[FromName] [varchar](255) NOT NULL,
	[FromEmailAddress] [varchar](255) NOT NULL,
	[ReplyToEmailAddress] [varchar](255) NOT NULL,
	[Status] [int] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
	[ScheduleTime] [datetime] NOT NULL,
	[StartingTime] [datetime] NOT NULL,
	[LastSentTime] [datetime] NOT NULL,
	[Deleted] [bit] NOT NULL,
	[ABTestTestPercentage] [decimal](13, 3) NOT NULL,
	[ABTestTestMinutes] [int] NOT NULL,
	[ABTestBestFitCriterion] [int] NOT NULL,
	[ABTestStatus] [int] NOT NULL,
	[ABTestBestFitMessageIndex] [int] NOT NULL,
 CONSTRAINT [PK_CAMPAIGN] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[CampaignMessage]') AND type in (N'U'))
BEGIN
CREATE TABLE [CampaignMessage](
	[Id] [uniqueidentifier] NOT NULL,
	[CampaignId] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[EditingMode] [int] NOT NULL,
	[Subject] [nvarchar](255) NOT NULL,
	[SentCount] [int] NOT NULL,
	[OpenedCount] [int] NOT NULL,
	[UniqueClickedCount] [int] NOT NULL,
	[BouncedCount] [int] NOT NULL,
	[UnsubscribedCount] [int] NOT NULL,
	[ClickedCount] [int] NOT NULL,
	[UniqueOpenedCount] [int] NOT NULL,
	[ForwardCount] [int] NOT NULL,
	[UniqueForwardCount] [int] NOT NULL,
	[ContentReady] [bit] NOT NULL,
 CONSTRAINT [PK_CAMPAIGNMESSAGE] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[CampaignNList]') AND type in (N'U'))
BEGIN
CREATE TABLE [CampaignNList](
	[CampaignId] [uniqueidentifier] NOT NULL,
	[ListId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_CAMPAIGNNLIST] PRIMARY KEY CLUSTERED 
(
	[ListId] ASC,
	[CampaignId] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[CampaignTask]') AND type in (N'U'))
BEGIN
CREATE TABLE [CampaignTask](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[WorkerId] [int] NOT NULL,
	[ScheduleTime] [datetime] NOT NULL,
	[MessageIndex] [int] NOT NULL,
	[MessageSentCount] [varchar](20) NOT NULL,
	[LastCustomerId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_CAMPAIGNTASK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Click]') AND type in (N'U'))
BEGIN
CREATE TABLE [Click](
	[Id] [uniqueidentifier] NOT NULL,
	[LinkId] [uniqueidentifier] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[EventTime] [datetime] NOT NULL,
	[MessageId] [uniqueidentifier] NOT NULL,
	[MessageType] [int] NOT NULL,
	[AccoutId] [int] NOT NULL,
	[IP] [varchar](50) NULL,
 CONSTRAINT [PK_CLICK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[CommunicatorUser]') AND type in (N'U'))
BEGIN
CREATE TABLE [CommunicatorUser](
	[UserName] [varchar](255) NOT NULL,
	[EmailAddress] [varchar](255) NULL,
	[IsAdmin] [bit] NOT NULL,
	[CurrentAccountId] [int] NULL,
	[CreationTime] [datetime] NOT NULL,
	[Settings] [varchar](1024) NULL,
 CONSTRAINT [PK_COMMUNICATORUSER] PRIMARY KEY CLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ConfirmOptIn]') AND type in (N'U'))
BEGIN
CREATE TABLE [ConfirmOptIn](
	[Id] [uniqueidentifier] NOT NULL,
	[ListId] [uniqueidentifier] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[EventTime] [datetime] NOT NULL,
	[AccountId] [int] NOT NULL,
	[IP] [varchar](50) NULL,
	[UserAgent] [varchar](1024) NULL,
 CONSTRAINT [PK_CONFIRMOPTIN] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Customer]') AND type in (N'U'))
BEGIN
CREATE TABLE [Customer](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[EmailAddress] [varchar](255) NOT NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](50) NULL,
	[Field1] [nvarchar](255) NULL,
	[Field2] [nvarchar](255) NULL,
	[Field3] [nvarchar](255) NULL,
	[Field4] [nvarchar](255) NULL,
	[Field5] [nvarchar](255) NULL,
	[Field6] [nvarchar](255) NULL,
	[Field7] [nvarchar](255) NULL,
	[Field8] [nvarchar](255) NULL,
	[Field9] [nvarchar](255) NULL,
	[Field10] [nvarchar](255) NULL,
 CONSTRAINT [PK_CUSTOMER] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[CustomerKeyword]') AND type in (N'U'))
BEGIN
CREATE TABLE [CustomerKeyword](
	[AccountId] [int] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[Keyword] [varchar](255) NOT NULL,
 CONSTRAINT [PK_CUSTOMERKEYWORD] PRIMARY KEY CLUSTERED 
(
	[AccountId] ASC,
	[CustomerId] ASC,
	[Keyword] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Forward]') AND type in (N'U'))
BEGIN
CREATE TABLE [Forward](
	[Id] [uniqueidentifier] NOT NULL,
	[MessageId] [uniqueidentifier] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[EventTime] [datetime] NOT NULL,
	[MessageType] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
	[EmailAddresses] [varchar](1024) NULL,
 CONSTRAINT [PK_FORWARD] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Link]') AND type in (N'U'))
BEGIN
CREATE TABLE [Link](
	[Id] [uniqueidentifier] NOT NULL,
	[MessageId] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[MessageType] [int] NOT NULL,
	[Url] [varchar](1024) NULL,
	[ClickedCount] [int] NOT NULL,
	[UniqueClickedCount] [int] NOT NULL,
 CONSTRAINT [PK_LINK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ListServer]') AND type in (N'U'))
BEGIN
CREATE TABLE [ListServer](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[ListId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Enabled] [bit] NOT NULL,
	[IsPublic] [bit] NOT NULL,
	[FilterSubject] [nvarchar](1024) NULL,
	[FilterFrom] [varchar](1024) NULL,
	[PopEmailAddress] [varchar](255) NULL,
	[Pop] [varchar](1024) NULL,
	[CreationTime] [datetime] NOT NULL,
	[Deleted] [bit] NOT NULL,
 CONSTRAINT [PK_LISTSERVER] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ListServerForward]') AND type in (N'U'))
BEGIN
CREATE TABLE [ListServerForward](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[ListServerId] [uniqueidentifier] NOT NULL,
	[MessageId] [varchar](255) NULL,
	[FromEmailAddress] [varchar](255) NULL,
	[Subject] [varchar](255) NULL,
	[SentCount] [int] NOT NULL,
	[Status] [int] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
	[StartingTime] [datetime] NOT NULL,
	[LastSentTime] [datetime] NOT NULL,
 CONSTRAINT [PK_LISTSERVERFORWARD] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ListServerForwardTask]') AND type in (N'U'))
BEGIN
CREATE TABLE [ListServerForwardTask](
	[Id] [uniqueidentifier] NOT NULL,
	[WorkerId] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
	[SentCount] [int] NOT NULL,
	[ScheduleTime] [datetime] NOT NULL,
 CONSTRAINT [PK_LISTSERVERFORWARDTASK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[MessageQueueItem]') AND type in (N'U'))
BEGIN
CREATE TABLE [MessageQueueItem](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[MessageId] [uniqueidentifier] NOT NULL,
	[MessageType] [int] NOT NULL,
	[ToAddress] [varchar](255) NULL,
	[FromName] [nvarchar](255) NULL,
	[FromEmailAddress] [varchar](255) NULL,
	[ReplyToEmailAddress] [varchar](255) NULL,
	[Subject] [varchar](1024) NULL,
	[ScheduleTime] [datetime] NOT NULL,
 CONSTRAINT [PK_MESSAGEQUEUEITEM] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Open]') AND type in (N'U'))
BEGIN
CREATE TABLE [Open](
	[Id] [uniqueidentifier] NOT NULL,
	[MessageId] [uniqueidentifier] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[EventTime] [datetime] NOT NULL,
	[MessageType] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
	[UserAgent] [varchar](1024) NULL,
	[IP] [varchar](50) NULL,
	[EmailClientId] [varchar](50) NULL,
	[Domain] [varchar](255) NULL,
 CONSTRAINT [PK_OPEN] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Segment]') AND type in (N'U'))
BEGIN
CREATE TABLE [Segment](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Expression] [nvarchar](1024) NULL,
	[CreationTime] [datetime] NOT NULL,
 CONSTRAINT [PK_SEGMENT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Subscriber]') AND type in (N'U'))
BEGIN
CREATE TABLE [Subscriber](
	[CustomerId] [uniqueidentifier] NOT NULL,
	[ListId] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[Status] [int] NOT NULL,
	[ModificationSource] [int] NOT NULL,
	[LastModifiedTime] [datetime] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
 CONSTRAINT [PK_SUBSCRIBER] PRIMARY KEY CLUSTERED 
(
	[CustomerId] ASC,
	[ListId] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[SubscriberImport]') AND type in (N'U'))
BEGIN
CREATE TABLE [SubscriberImport](
	[Id] [uniqueidentifier] NOT NULL,
	[ListId] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[DataProviderName] [varchar](50) NOT NULL,
	[DataSourceInfo] [varchar](1024) NULL,
	[SkipLines] [int] NOT NULL,
	[DirtyDataAction] [int] NOT NULL,
	[DuplicationAction] [int] NOT NULL,
	[Mappings] [varchar](1024) NOT NULL,
	[Count] [int] NOT NULL,
	[ImportedCount] [int] NOT NULL,
	[Status] [int] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
	[StartingTime] [datetime] NOT NULL,
	[EndTime] [datetime] NOT NULL,
	[Exception] [varchar](255) NULL,
 CONSTRAINT [PK_SUBSCRIBERIMPORT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[SubscriberImportTask]') AND type in (N'U'))
BEGIN
CREATE TABLE [SubscriberImportTask](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[ImportedCount] [int] NOT NULL,
	[ScheduleTime] [datetime] NOT NULL,
	[WorkerId] [int] NOT NULL,
 CONSTRAINT [PK_SUBSCRIBERIMPORTTASK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[SubscriberList]') AND type in (N'U'))
BEGIN
CREATE TABLE [SubscriberList](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[ListType] [int] NOT NULL,
	[SubscriptionType] [int] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
	[Deleted] [bit] NOT NULL,
	[SignUpFields] [varchar](1024) NULL,
	[EnableSignUp] [bit] NOT NULL,
	[SignUpRedirectUrl] [varchar](255) NULL,
	[ConfirmUrl] [varchar](255) NULL,
	[ConfirmMailId] [uniqueidentifier] NULL,
	[EnableSubscribedMail] [bit] NOT NULL,
	[SubscribedMailId] [uniqueidentifier] NULL,
	[EnableUnsubscribedMail] [bit] NOT NULL,
	[UnsubscribedMailId] [uniqueidentifier] NULL,
	[UnsubscribeUrl] [varchar](255) NULL,
 CONSTRAINT [PK_SUBSCRIBERLIST] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[SubscriberListEvent]') AND type in (N'U'))
BEGIN
CREATE TABLE [SubscriberListEvent](
	[Id] [uniqueidentifier] NOT NULL,
	[ListId] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[EventTime] [datetime] NOT NULL,
	[FromStatus] [int] NOT NULL,
	[ToStatus] [int] NOT NULL,
	[EventSource] [int] NOT NULL,
 CONSTRAINT [PK_SUBSCRIBERLISTEVENT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Survey_Answer]') AND type in (N'U'))
BEGIN
CREATE TABLE [Survey_Answer](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[QuestionId] [uniqueidentifier] NOT NULL,
	[PostDataId] [uniqueidentifier] NOT NULL,
	[AnswerHtmlId] [nvarchar](250) NULL,
	[AnswerType] [int] NOT NULL,
	[AnswerText] [nvarchar](max) NULL,
	[CommentText] [nvarchar](max) NULL,
 CONSTRAINT [PK_SURVEY_ANSWER] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Survey_Form]') AND type in (N'U'))
BEGIN
CREATE TABLE [Survey_Form](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[FormName] [nvarchar](250) NULL,
	[FormHtml] [nvarchar](max) NULL,
	[CreateTime] [datetime] NOT NULL,
	[PublishTime] [datetime] NULL,
	[StartTime] [datetime] NULL,
	[EndTime] [datetime] NULL,
	[VisitCount] [int] NOT NULL,
	[Paused] [bit] NOT NULL,
	[JoinPassword] [nvarchar](255) NULL,
	[RespondResult] [bit] NULL,
	[SendEmail] [bit] NOT NULL,
	[ValidatorType] [nvarchar](50) NULL,
	[Deleted] [bit] NOT NULL,
 CONSTRAINT [PK_SURVEY_FORM] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Survey_PostData]') AND type in (N'U'))
BEGIN
CREATE TABLE [Survey_PostData](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[FormId] [uniqueidentifier] NOT NULL,
	[ContactId] [nvarchar](250) NULL,
	[PostDate] [datetime] NOT NULL,
	[ClientIP] [nvarchar](50) NULL,
	[SourceType] [int] NOT NULL,
	[ClientBrowser] [nvarchar](50) NULL,
	[ClientPlatform] [nvarchar](50) NULL,
	[ValidToken] [nvarchar](500) NULL,
 CONSTRAINT [PK_SURVEY_POSTDATA] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Survey_Preview]') AND type in (N'U'))
BEGIN
CREATE TABLE [Survey_Preview](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[FormName] [nvarchar](255) NULL,
	[FormHtml] [nvarchar](max) NULL,
	[CreateData] [datetime] NOT NULL,
 CONSTRAINT [PK_SURVEY_PREVIEW] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Survey_Question]') AND type in (N'U'))
BEGIN
CREATE TABLE [Survey_Question](
	[Id] [uniqueidentifier] NOT NULL,
	[AccountId] [int] NOT NULL,
	[FormId] [uniqueidentifier] NOT NULL,
	[QuestionText] [nvarchar](255) NULL,
	[QuestionIndex] [int] NOT NULL,
	[QuestionHtmlId] [nvarchar](255) NULL,
	[IsRequired] [bit] NOT NULL,
	[AllowComment] [bit] NOT NULL,
	[Deleted] [bit] NOT NULL,
 CONSTRAINT [PK_SURVEY_QUESTION] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Unsubscribe]') AND type in (N'U'))
BEGIN
CREATE TABLE [Unsubscribe](
	[Id] [uniqueidentifier] NOT NULL,
	[MessageId] [uniqueidentifier] NOT NULL,
	[CustomerId] [uniqueidentifier] NOT NULL,
	[EventTime] [datetime] NOT NULL,
	[MessageType] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
 CONSTRAINT [PK_UNSUBSCRIBE] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[WorkerException]') AND type in (N'U'))
BEGIN
CREATE TABLE [WorkerException](
	[Id] [uniqueidentifier] NOT NULL,
	[WorkerId] [int] NOT NULL,
	[WorkerName] [varchar](255) NULL,
	[Readed] [bit] NOT NULL,
	[ExceptionTime] [datetime] NOT NULL,
	[Message] [varchar](255) NULL,
	[StackTrace] [varchar](max) NULL,
 CONSTRAINT [PK_WORKEREXCEPTION] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Account]') AND type in (N'U'))
BEGIN
CREATE TABLE [Account](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](255) NULL,
	[PublicAccessKey] [varchar](50) NULL,
	[ApiKey] [varchar](50) NULL,
	[Culture] [varchar](50) NULL,
	[TimeZone] [varchar](50) NULL,
	[Encoding] [varchar](50) NULL,
	[Enabled] [bit] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
	[Settings] [varchar](1024) NULL,
 CONSTRAINT [PK_ACCOUNT] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[AccountUser]') AND type in (N'U'))
BEGIN
CREATE TABLE [AccountUser](
	[AccountId] [int] NOT NULL,
	[UserName] [varchar](255) NOT NULL,
	[RoleIds] [varchar](1024) NULL,
	[CreationTime] [datetime] NOT NULL,
 CONSTRAINT [PK_ACCOUNTUSER] PRIMARY KEY CLUSTERED 
(
	[AccountId] ASC,
	[UserName] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[AutoResponder]') AND type in (N'U'))
BEGIN
CREATE TABLE [AutoResponder](
	[Id] [uniqueidentifier] NOT NULL,
	[Subject] [nvarchar](255) NULL,
	[EditingMode] [int] NOT NULL,
	[ContentReady] [bit] NOT NULL,
	[SentCount] [int] NOT NULL,
	[OpenedCount] [int] NOT NULL,
	[UniqueOpenedCount] [int] NOT NULL,
	[ClickedCount] [int] NOT NULL,
	[UniqueClickedCount] [int] NOT NULL,
	[ForwardedCount] [int] NOT NULL,
	[UniqueForwardedCount] [int] NOT NULL,
	[BouncedCount] [int] NOT NULL,
	[UnsubscribedCount] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
	[ListId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](255) NULL,
	[TypeName] [varchar](50) NULL,
	[Trigger] [varchar](1024) NULL,
	[FromName] [nvarchar](255) NULL,
	[FromEmailAddress] [varchar](255) NULL,
	[ReplyToEmailAddress] [varchar](255) NULL,
	[CreationTime] [datetime] NOT NULL,
	[Deleted] [bit] NOT NULL,
 CONSTRAINT [PK_AUTORESPONDER] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
SET ANSI_PADDING OFF
GO

----------------------------------------------
-- Version 1.03
----------------------------------------------

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Settings]') AND type in (N'U'))
BEGIN

-- Modify table Account field Settings to varchar(MAX)
CREATE TABLE dbo.Tmp_Account
	(
	Id int NOT NULL,
	Name nvarchar(255) NULL,
	PublicAccessKey varchar(50) NULL,
	ApiKey varchar(50) NULL,
	Culture varchar(50) NULL,
	TimeZone varchar(50) NULL,
	Encoding varchar(50) NULL,
	Enabled bit NOT NULL,
	CreationTime datetime NOT NULL,
	Settings varchar(MAX) NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]

IF EXISTS(SELECT * FROM dbo.Account)
	 EXEC('INSERT INTO dbo.Tmp_Account (Id, Name, PublicAccessKey, ApiKey, Culture, TimeZone, Encoding, Enabled, CreationTime, Settings)
		SELECT Id, Name, PublicAccessKey, ApiKey, Culture, TimeZone, Encoding, Enabled, CreationTime, CONVERT(varchar(MAX), Settings) FROM dbo.Account WITH (HOLDLOCK TABLOCKX)')

DROP TABLE dbo.Account

EXECUTE sp_rename N'dbo.Tmp_Account', N'Account', 'OBJECT' 

ALTER TABLE dbo.Account ADD CONSTRAINT
	PK_ACCOUNT PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]


-- Rename table Survey_Preview field CreateData to CreateDate
EXECUTE sp_rename N'dbo.Survey_Preview.CreateData', N'Tmp_CreateDate_2', 'COLUMN' 
EXECUTE sp_rename N'dbo.Survey_Preview.Tmp_CreateDate_2', N'CreateDate', 'COLUMN' 

-- Create table Settings 
CREATE TABLE dbo.Settings
	(
	[Key] varchar(50) NOT NULL,
	Value varchar(1024) NULL
	)  ON [PRIMARY]
ALTER TABLE dbo.Settings ADD CONSTRAINT
	PK_Table_1 PRIMARY KEY CLUSTERED 
	(
	[Key]
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
INSERT dbo.Settings ([Key], [Value]) values ('Version', '1.03')
END


--------------------------------------------
-- Update
--------------------------------------------
DECLARE @Version as varchar(255)
SET @Version = (SELECT [Value] FROM Settings WHERE [Key]='Version')

--------------------------------------------
-- Version 1.04
--------------------------------------------
IF @Version < '1.04'
BEGIN

create index IDX_AutoResponder_ListId on AutoResponder (
ListId ASC,
Deleted ASC,
CreationTime DESC
)

create index IDX_Bounce_PopMessageId on Bounce (
PopMessageId ASC
)

create index IDX_Bounce_MessageId on Bounce (
MessageId ASC
)

create index IDX_Campaign_Query on Campaign (
AccountId ASC,
Deleted ASC,
Status ASC
)

create index IDX_CampaignMessage_CampaignId on CampaignMessage (
CampaignId ASC
)

create index IDX_CampaignNList_ListId on CampaignNList (
ListId ASC
)

create index IDX_Click_MessageId on Click (
MessageId ASC,
CustomerId ASC
)

create index IDX_Click_LinkId on Click (
LinkId ASC
)

create index IDX_ConfirmOptIn_ListId on ConfirmOptIn (
ListId ASC
)

create index IDX_Customer_EmailAddress on Customer (
EmailAddress ASC
)

create index IDX_CustomerKeyword_Keyword on CustomerKeyword (
AccountId ASC,
Keyword ASC
)

create index IDX_Forward_MessageId on Forward (
MessageId ASC
)

create index IDX_Link_MessageId on Link (
MessageId ASC
)

create index IDX_ListServerForward_Query on ListServerForward (
AccountId ASC,
ListServerId ASC,
CreationTime DESC
)

create index IDX_ListServerForward_MessageId on ListServerForward (
MessageId ASC
)

create index IDX_Open_MessageId on "Open" (
MessageId ASC,
CustomerId ASC
)

create index IDX_Open_EmailClientId on "Open" (
EmailClientId ASC
)

create index IDX_Subscriber_Status on Subscriber (
ListId DESC,
Status DESC,
LastModifiedTime DESC
)

create index IDX_SubscriberImportStatus on SubscriberImport (
AccountId ASC,
Status DESC,
CreationTime DESC
)

create index IDX_SubscriberListName on SubscriberList (
AccountId ASC,
Name ASC
)

create index IDX_SubscriberListQuery on SubscriberList (
AccountId ASC,
Deleted ASC,
CreationTime ASC
)

create index IDX_SubscriberListEvent_FromStatusQuery on SubscriberListEvent (
ListId ASC,
FromStatus ASC,
EventTime ASC
)

create index IDX_SubscriberListEvent_ToStatusQuery on SubscriberListEvent (
ListId ASC,
ToStatus ASC,
EventTime ASC
)

create index IDX_SurveyAnswer_QuestionId on Survey_Answer (
QuestionId ASC
)

create index IDX_SuveyAnswer_PostDataId on Survey_Answer (
PostDataId ASC
)

create index IDX_SurveyForm_Query on Survey_Form (
AccountId ASC,
FormName ASC
)

create index IDX_SurveyPostData_FormId on Survey_PostData (
FormId ASC
)

create index IDEX_SurveyQuestion_FormId on Survey_Question (
FormId ASC
)

create index IDX_Unsubscribe_MessageId on Unsubscribe (
MessageId ASC
)

create index IDX_WorkerException_WorkerName on WorkerException (
WorkerName ASC
)

-- Add field LastModifiedTime to table CampaignMessage

EXEC('ALTER TABLE dbo.CampaignMessage ADD
	LastModifiedTime datetime NULL')

EXEC('UPDATE CampaignMessage SET LastModifiedTime=(SELECT CreationTime FROM Campaign WHERE Campaign.Id=CampaignMessage.CampaignId)')

EXEC('CREATE TABLE dbo.Tmp_CampaignMessage
	(
	Id uniqueidentifier NOT NULL,
	CampaignId uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	EditingMode int NOT NULL,
	Subject nvarchar(255) NOT NULL,
	SentCount int NOT NULL,
	OpenedCount int NOT NULL,
	UniqueClickedCount int NOT NULL,
	BouncedCount int NOT NULL,
	UnsubscribedCount int NOT NULL,
	ClickedCount int NOT NULL,
	UniqueOpenedCount int NOT NULL,
	ForwardCount int NOT NULL,
	UniqueForwardCount int NOT NULL,
	ContentReady bit NOT NULL,
	LastModifiedTime datetime NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.CampaignMessage)
	 EXEC('INSERT INTO dbo.Tmp_CampaignMessage (Id, CampaignId, AccountId, EditingMode, Subject, SentCount, OpenedCount, UniqueClickedCount, BouncedCount, UnsubscribedCount, ClickedCount, UniqueOpenedCount, ForwardCount, UniqueForwardCount, ContentReady, LastModifiedTime)
		SELECT Id, CampaignId, AccountId, EditingMode, Subject, SentCount, OpenedCount, UniqueClickedCount, BouncedCount, UnsubscribedCount, ClickedCount, UniqueOpenedCount, ForwardCount, UniqueForwardCount, ContentReady, LastModifiedTime FROM dbo.CampaignMessage WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.CampaignMessage')

EXECUTE sp_rename N'dbo.Tmp_CampaignMessage', N'CampaignMessage', 'OBJECT' 

EXEC('ALTER TABLE dbo.CampaignMessage ADD CONSTRAINT
	PK_CAMPAIGNMESSAGE PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_CampaignMessage_CampaignId ON dbo.CampaignMessage
	(
	CampaignId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


-- Add field LastModifiedTime to table AutoResponder

EXEC('ALTER TABLE dbo.AutoResponder ADD	LastModifiedTime datetime NULL')

EXEC('UPDATE dbo.AutoResponder SET LastModifiedTime=CreationTime')

EXEC('CREATE TABLE dbo.Tmp_AutoResponder
	(
	Id uniqueidentifier NOT NULL,
	Subject nvarchar(255) NULL,
	EditingMode int NOT NULL,
	ContentReady bit NOT NULL,
	SentCount int NOT NULL,
	OpenedCount int NOT NULL,
	UniqueOpenedCount int NOT NULL,
	ClickedCount int NOT NULL,
	UniqueClickedCount int NOT NULL,
	ForwardedCount int NOT NULL,
	UniqueForwardedCount int NOT NULL,
	BouncedCount int NOT NULL,
	UnsubscribedCount int NOT NULL,
	AccountId int NOT NULL,
	ListId uniqueidentifier NOT NULL,
	Name nvarchar(255) NULL,
	TypeName varchar(50) NULL,
	[Trigger] varchar(1024) NULL,
	FromName nvarchar(255) NULL,
	FromEmailAddress varchar(255) NULL,
	ReplyToEmailAddress varchar(255) NULL,
	CreationTime datetime NOT NULL,
	Deleted bit NOT NULL,
	LastModifiedTime datetime NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.AutoResponder)
	 EXEC('INSERT INTO dbo.Tmp_AutoResponder (Id, Subject, EditingMode, ContentReady, SentCount, OpenedCount, UniqueOpenedCount, ClickedCount, UniqueClickedCount, ForwardedCount, UniqueForwardedCount, BouncedCount, UnsubscribedCount, AccountId, ListId, Name, TypeName, [Trigger], FromName, FromEmailAddress, ReplyToEmailAddress, CreationTime, Deleted, LastModifiedTime)
		SELECT Id, Subject, EditingMode, ContentReady, SentCount, OpenedCount, UniqueOpenedCount, ClickedCount, UniqueClickedCount, ForwardedCount, UniqueForwardedCount, BouncedCount, UnsubscribedCount, AccountId, ListId, Name, TypeName, [Trigger], FromName, FromEmailAddress, ReplyToEmailAddress, CreationTime, Deleted, LastModifiedTime FROM dbo.AutoResponder WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.AutoResponder')

EXECUTE sp_rename N'dbo.Tmp_AutoResponder', N'AutoResponder', 'OBJECT' 

EXEC('ALTER TABLE dbo.AutoResponder ADD CONSTRAINT
	PK_AUTORESPONDER PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_AutoResponder_ListId ON dbo.AutoResponder
	(
	ListId,
	Deleted,
	CreationTime DESC
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


UPDATE dbo.Settings SET [Value]='1.04' WHERE [Key]='Version'

END


--------------------------------------------
-- Version 1.06
--------------------------------------------

IF @Version < '1.06'
BEGIN
-- Add Failure table
EXEC('create table Failure (
   Id                   uniqueidentifier     not null,
   MessageId            uniqueidentifier     not null,
   CustomerId           uniqueidentifier     not null,
   EventTime            datetime             not null,
   MessageType          int                  not null,
   AccountId            int                  not null,
   Message              varchar(1024)        null
)')

EXEC('alter table Failure
   add constraint PK_FAILURE primary key (Id)')

EXEC('create index IDX_Failure_MessageId on Failure (
	MessageId ASC,
	CustomerId ASC
)')

-- Add FailedCount field to CampaignMessage table
EXEC('ALTER TABLE dbo.CampaignMessage ADD 
	FailedCount int NULL
')

EXEC('update CampaignMessage set FailedCount=0')

EXEC('CREATE TABLE dbo.Tmp_CampaignMessage
	(
	Id uniqueidentifier NOT NULL,
	CampaignId uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	EditingMode int NOT NULL,
	Subject nvarchar(255) NOT NULL,
	SentCount int NOT NULL,
	OpenedCount int NOT NULL,
	UniqueClickedCount int NOT NULL,
	BouncedCount int NOT NULL,
	UnsubscribedCount int NOT NULL,
	ClickedCount int NOT NULL,
	UniqueOpenedCount int NOT NULL,
	ForwardCount int NOT NULL,
	UniqueForwardCount int NOT NULL,
	ContentReady bit NOT NULL,
	LastModifiedTime datetime NOT NULL,
	FailedCount int NOT NULL
	)  ON [PRIMARY]
')
IF EXISTS(SELECT * FROM dbo.CampaignMessage)
	 EXEC('INSERT INTO dbo.Tmp_CampaignMessage (Id, CampaignId, AccountId, EditingMode, Subject, SentCount, OpenedCount, UniqueClickedCount, BouncedCount, UnsubscribedCount, ClickedCount, UniqueOpenedCount, ForwardCount, UniqueForwardCount, ContentReady, LastModifiedTime, FailedCount)
		SELECT Id, CampaignId, AccountId, EditingMode, Subject, SentCount, OpenedCount, UniqueClickedCount, BouncedCount, UnsubscribedCount, ClickedCount, UniqueOpenedCount, ForwardCount, UniqueForwardCount, ContentReady, LastModifiedTime, FailedCount FROM dbo.CampaignMessage WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.CampaignMessage')

EXECUTE sp_rename N'dbo.Tmp_CampaignMessage', N'CampaignMessage', 'OBJECT' 

EXEC('ALTER TABLE dbo.CampaignMessage ADD CONSTRAINT
	PK_CAMPAIGNMESSAGE PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
')

EXEC('CREATE NONCLUSTERED INDEX IDX_CampaignMessage_CampaignId ON dbo.CampaignMessage
	(
	CampaignId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
')

-- Add Exception field to Campaign table
EXEC('ALTER TABLE dbo.Campaign ADD
	Exception varchar(1024) NULL
')

-- Add ABTestTestCount field to Campaign table
EXEC('ALTER TABLE dbo.Campaign ADD
	ABTestTestCount int NULL')

EXEC('update Campaign set ABTestTestCount=0')

EXEC('CREATE TABLE dbo.Tmp_Campaign
	(
	Id uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	Name nvarchar(255) NULL,
	SendingMode int NOT NULL,
	FromName varchar(255) NOT NULL,
	FromEmailAddress varchar(255) NOT NULL,
	ReplyToEmailAddress varchar(255) NOT NULL,
	Status int NOT NULL,
	CreationTime datetime NOT NULL,
	ScheduleTime datetime NOT NULL,
	StartingTime datetime NOT NULL,
	LastSentTime datetime NOT NULL,
	Deleted bit NOT NULL,
	ABTestTestPercentage decimal(13, 3) NOT NULL,
	ABTestTestMinutes int NOT NULL,
	ABTestBestFitCriterion int NOT NULL,
	ABTestStatus int NOT NULL,
	ABTestBestFitMessageIndex int NOT NULL,
	Exception varchar(1024) NULL,
	ABTestTestCount int NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Campaign)
	 EXEC('INSERT INTO dbo.Tmp_Campaign (Id, AccountId, Name, SendingMode, FromName, FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount)
		SELECT Id, AccountId, Name, SendingMode, FromName, FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount FROM dbo.Campaign WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Campaign')

EXECUTE sp_rename N'dbo.Tmp_Campaign', N'Campaign', 'OBJECT' 

EXEC('ALTER TABLE dbo.Campaign ADD CONSTRAINT
	PK_CAMPAIGN PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


EXEC('CREATE NONCLUSTERED INDEX IDX_Campaign_Query ON dbo.Campaign
	(
	AccountId,
	Deleted,
	Status
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

-- Add Reputation field to Account table
EXEC('ALTER TABLE dbo.Account ADD
	Reputation int NULL')

EXEC('update Account set Reputation = 0')

EXEC('CREATE TABLE dbo.Tmp_Account
	(
	Id int NOT NULL,
	Name nvarchar(255) NULL,
	PublicAccessKey varchar(50) NULL,
	ApiKey varchar(50) NULL,
	Culture varchar(50) NULL,
	TimeZone varchar(50) NULL,
	Encoding varchar(50) NULL,
	Enabled bit NOT NULL,
	CreationTime datetime NOT NULL,
	Settings varchar(MAX) NULL,
	Reputation int NOT NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Account)
	 EXEC('INSERT INTO dbo.Tmp_Account (Id, Name, PublicAccessKey, ApiKey, Culture, TimeZone, Encoding, Enabled, CreationTime, Settings, Reputation)
		SELECT Id, Name, PublicAccessKey, ApiKey, Culture, TimeZone, Encoding, Enabled, CreationTime, Settings, Reputation FROM dbo.Account WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Account')

EXECUTE sp_rename N'dbo.Tmp_Account', N'Account', 'OBJECT' 

EXEC('ALTER TABLE dbo.Account ADD CONSTRAINT
	PK_ACCOUNT PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

-- Add Reputation field to CampaignTask table
EXEC('ALTER TABLE dbo.CampaignTask ADD
	Reputation int NULL')

EXEC('update CampaignTask set Reputation = 0')

EXEC('CREATE TABLE dbo.Tmp_CampaignTask
	(
	Id uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	WorkerId int NOT NULL,
	ScheduleTime datetime NOT NULL,
	MessageIndex int NOT NULL,
	MessageSentCount varchar(20) NOT NULL,
	LastCustomerId uniqueidentifier NOT NULL,
	Reputation int NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.CampaignTask)
	 EXEC('INSERT INTO dbo.Tmp_CampaignTask (Id, AccountId, WorkerId, ScheduleTime, MessageIndex, MessageSentCount, LastCustomerId, Reputation)
		SELECT Id, AccountId, WorkerId, ScheduleTime, MessageIndex, MessageSentCount, LastCustomerId, Reputation FROM dbo.CampaignTask WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.CampaignTask')

EXECUTE sp_rename N'dbo.Tmp_CampaignTask', N'CampaignTask', 'OBJECT' 

EXEC('ALTER TABLE dbo.CampaignTask ADD CONSTRAINT
	PK_CAMPAIGNTASK PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

-- Add Code and Category field to Bounce table
EXEC('ALTER TABLE dbo.Bounce ADD
	Code int NULL,
	Category varchar(255) NULL')

EXEC('update Bounce set Code=0')

EXEC('CREATE TABLE dbo.Tmp_Bounce
	(
	Id uniqueidentifier NOT NULL,
	PopMessageId varchar(1024) NULL,
	MessageId uniqueidentifier NOT NULL,
	CustomerId uniqueidentifier NOT NULL,
	EventTime datetime NOT NULL,
	MessageType int NOT NULL,
	AccountId int NOT NULL,
	Code int NOT NULL,
	Category varchar(255) NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Bounce)
	 EXEC('INSERT INTO dbo.Tmp_Bounce (Id, PopMessageId, MessageId, CustomerId, EventTime, MessageType, AccountId, Code, Category)
		SELECT Id, PopMessageId, MessageId, CustomerId, EventTime, MessageType, AccountId, Code, Category FROM dbo.Bounce WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Bounce')

EXECUTE sp_rename N'dbo.Tmp_Bounce', N'Bounce', 'OBJECT' 

EXEC('ALTER TABLE dbo.Bounce ADD CONSTRAINT
	PK_BOUNCE PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_Bounce_PopMessageId ON dbo.Bounce
	(
	PopMessageId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_Bounce_MessageId ON dbo.Bounce
	(
	MessageId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')



UPDATE dbo.Settings SET [Value]='1.06' WHERE [Key]='Version'

END



--------------------------------------------
-- Version 1.07
--------------------------------------------

IF @Version < '1.07'
BEGIN

-- Add PlannedSubscriberCount field to Campaign table
EXEC('ALTER TABLE dbo.Campaign ADD
	PlannedSubscriberCount int NULL')

EXEC('update Campaign set PlannedSubscriberCount=(select sum(SentCount) from CampaignMessage where CampaignMessage.CampaignId=Campaign.Id)')

EXEC('CREATE TABLE dbo.Tmp_Campaign
	(
	Id uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	Name nvarchar(255) NULL,
	SendingMode int NOT NULL,
	FromName varchar(255) NOT NULL,
	FromEmailAddress varchar(255) NOT NULL,
	ReplyToEmailAddress varchar(255) NOT NULL,
	Status int NOT NULL,
	CreationTime datetime NOT NULL,
	ScheduleTime datetime NOT NULL,
	StartingTime datetime NOT NULL,
	LastSentTime datetime NOT NULL,
	Deleted bit NOT NULL,
	ABTestTestPercentage decimal(13, 3) NOT NULL,
	ABTestTestMinutes int NOT NULL,
	ABTestBestFitCriterion int NOT NULL,
	ABTestStatus int NOT NULL,
	ABTestBestFitMessageIndex int NOT NULL,
	Exception varchar(1024) NULL,
	ABTestTestCount int NOT NULL,
	PlannedSubscriberCount int NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Campaign)
	 EXEC('INSERT INTO dbo.Tmp_Campaign (Id, AccountId, Name, SendingMode, FromName, FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount, PlannedSubscriberCount)
		SELECT Id, AccountId, Name, SendingMode, FromName, FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount, PlannedSubscriberCount FROM dbo.Campaign WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Campaign')

EXECUTE sp_rename N'dbo.Tmp_Campaign', N'Campaign', 'OBJECT' 

EXEC('ALTER TABLE dbo.Campaign ADD CONSTRAINT
	PK_CAMPAIGN PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_Campaign_Query ON dbo.Campaign
	(
	AccountId,
	Deleted,
	Status
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


-- Fill AccountId of CampaignMessage
EXEC('update CampaignMessage set AccountId=(select AccountId from Campaign where Campaign.Id=CampaignMessage.CampaignId)')

-- Rename AccountId
EXECUTE sp_rename N'dbo.Click.AccoutId', N'Tmp_AccountId', 'COLUMN' 
EXECUTE sp_rename N'dbo.Click.Tmp_AccountId', N'AccountId', 'COLUMN' 

-- Fill AccountId of Click
EXEC('update Click set AccountId=(select AccountId from CampaignMessage where Id=Click.MessageId)')

UPDATE dbo.Settings SET [Value]='1.07' WHERE [Key]='Version'

END


--------------------------------------------
-- Version 1.08
--------------------------------------------

IF @Version < '1.08'
BEGIN

-- Add Description field to SubscriberList table
EXEC('ALTER TABLE dbo.SubscriberList ADD
	Description varchar(255) NULL')

-- Add Domain, DiagnosticString field to Bounce table
EXEC('ALTER TABLE dbo.Bounce ADD
	Domain varchar(255) NULL,
	DiagnosticString varchar(255) NULL')

-- Add Segment field to Campaign table
EXEC('ALTER TABLE dbo.Campaign ADD
	Segment nvarchar(1024) NULL')

-- Add Password field to CommunicatorUser table
EXEC('ALTER TABLE dbo.CommunicatorUser ADD
	Password varchar(255) NULL')

-- Add SubStatus field to Subscriber table
EXEC('ALTER TABLE dbo.Subscriber ADD
	SubStatus int NULL')

EXEC('update Subscriber set SubStatus = 0')

EXEC('CREATE TABLE dbo.Tmp_Subscriber
	(
	CustomerId uniqueidentifier NOT NULL,
	ListId uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	Status int NOT NULL,
	ModificationSource int NOT NULL,
	LastModifiedTime datetime NOT NULL,
	CreationTime datetime NOT NULL,
	SubStatus int NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Subscriber)
	 EXEC('INSERT INTO dbo.Tmp_Subscriber (CustomerId, ListId, AccountId, Status, ModificationSource, LastModifiedTime, CreationTime, SubStatus)
		SELECT CustomerId, ListId, AccountId, Status, ModificationSource, LastModifiedTime, CreationTime, SubStatus FROM dbo.Subscriber WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Subscriber')

EXECUTE sp_rename N'dbo.Tmp_Subscriber', N'Subscriber', 'OBJECT' 

EXEC('ALTER TABLE dbo.Subscriber ADD CONSTRAINT
	PK_SUBSCRIBER PRIMARY KEY CLUSTERED 
	(
	CustomerId,
	ListId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_Subscriber_Status ON dbo.Subscriber
	(
	ListId DESC,
	Status DESC,
	LastModifiedTime DESC
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

-- Add ABTestLastSentTime and ABTestBestStartingTime field to Campaign table
EXEC('ALTER TABLE dbo.Campaign ADD
	ABTestLastTestSentTime datetime NULL,
	ABTestBestStartingTime datetime NULL')

EXEC('update Campaign set ABTestLastTestSentTime=''9999-12-31'', ABTestBestStartingTime=''9999-12-31''')

EXEC('CREATE TABLE dbo.Tmp_Campaign
	(
	Id uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	Name nvarchar(255) NULL,
	SendingMode int NOT NULL,
	FromName varchar(255) NOT NULL,
	FromEmailAddress varchar(255) NOT NULL,
	ReplyToEmailAddress varchar(255) NOT NULL,
	Status int NOT NULL,
	CreationTime datetime NOT NULL,
	ScheduleTime datetime NOT NULL,
	StartingTime datetime NOT NULL,
	LastSentTime datetime NOT NULL,
	Deleted bit NOT NULL,
	ABTestTestPercentage decimal(13, 3) NOT NULL,
	ABTestTestMinutes int NOT NULL,
	ABTestBestFitCriterion int NOT NULL,
	ABTestStatus int NOT NULL,
	ABTestBestFitMessageIndex int NOT NULL,
	Exception varchar(1024) NULL,
	ABTestTestCount int NOT NULL,
	PlannedSubscriberCount int NOT NULL,
	Segment nvarchar(1024) NULL,
	ABTestLastTestSentTime datetime NOT NULL,
	ABTestBestStartingTime datetime NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Campaign)
	 EXEC('INSERT INTO dbo.Tmp_Campaign (Id, AccountId, Name, SendingMode, FromName, FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount, PlannedSubscriberCount, Segment, ABTestLastTestSentTime, ABTestBestStartingTime)
		SELECT Id, AccountId, Name, SendingMode, FromName, FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount, PlannedSubscriberCount, Segment, ABTestLastTestSentTime, ABTestBestStartingTime FROM dbo.Campaign WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Campaign')

EXECUTE sp_rename N'dbo.Tmp_Campaign', N'Campaign', 'OBJECT' 

EXEC('ALTER TABLE dbo.Campaign ADD CONSTRAINT
	PK_CAMPAIGN PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_Campaign_Query ON dbo.Campaign
	(
	AccountId,
	Deleted,
	Status
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

-- Add OpenRedirectUrl field to CampaignMessage and AutoResponder table
EXEC('ALTER TABLE dbo.CampaignMessage ADD
	OpenRedirectUrl varchar(1024) NULL')

EXEC('ALTER TABLE dbo.AutoResponder ADD
	OpenRedirectUrl varchar(1024) NULL')

-- Rename ForwardCount to ForwardedCount, UniqueForwardCount to UniqueForwardedCount in CampaignMessage table
EXECUTE sp_rename N'dbo.CampaignMessage.ForwardCount', N'Tmp_ForwardedCount', 'COLUMN' 

EXECUTE sp_rename N'dbo.CampaignMessage.Tmp_ForwardedCount', N'ForwardedCount', 'COLUMN' 

EXECUTE sp_rename N'dbo.CampaignMessage.UniqueForwardCount', N'Tmp_UniqueForwardedCount', 'COLUMN' 

EXECUTE sp_rename N'dbo.CampaignMessage.Tmp_UniqueForwardedCount', N'UniqueForwardedCount', 'COLUMN' 

-- Add Index field to CampaignMessage table
ALTER TABLE dbo.CampaignMessage ADD
	[Index] int NULL

EXEC('update campaignmessage set [index]=0')

EXEC('CREATE TABLE dbo.Tmp_CampaignMessage
	(
	Id uniqueidentifier NOT NULL,
	CampaignId uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	EditingMode int NOT NULL,
	Subject nvarchar(255) NOT NULL,
	SentCount int NOT NULL,
	OpenedCount int NOT NULL,
	UniqueClickedCount int NOT NULL,
	BouncedCount int NOT NULL,
	UnsubscribedCount int NOT NULL,
	ClickedCount int NOT NULL,
	UniqueOpenedCount int NOT NULL,
	ForwardedCount int NOT NULL,
	UniqueForwardedCount int NOT NULL,
	ContentReady bit NOT NULL,
	LastModifiedTime datetime NOT NULL,
	FailedCount int NOT NULL,
	OpenRedirectUrl varchar(1024) NULL,
	[Index] int NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.CampaignMessage)
	 EXEC('INSERT INTO dbo.Tmp_CampaignMessage (Id, CampaignId, AccountId, EditingMode, Subject, SentCount, OpenedCount, UniqueClickedCount, BouncedCount, UnsubscribedCount, ClickedCount, UniqueOpenedCount, ForwardedCount, UniqueForwardedCount, ContentReady, LastModifiedTime, FailedCount, OpenRedirectUrl, [Index])
		SELECT Id, CampaignId, AccountId, EditingMode, Subject, SentCount, OpenedCount, UniqueClickedCount, BouncedCount, UnsubscribedCount, ClickedCount, UniqueOpenedCount, ForwardedCount, UniqueForwardedCount, ContentReady, LastModifiedTime, FailedCount, OpenRedirectUrl, [Index] FROM dbo.CampaignMessage WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.CampaignMessage')

EXECUTE sp_rename N'dbo.Tmp_CampaignMessage', N'CampaignMessage', 'OBJECT' 

EXEC('ALTER TABLE dbo.CampaignMessage ADD CONSTRAINT
	PK_CAMPAIGNMESSAGE PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_CampaignMessage_CampaignId ON dbo.CampaignMessage
	(
	CampaignId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

UPDATE dbo.Settings SET [Value]='1.08' WHERE [Key]='Version'

END



--------------------------------------------
-- Version 1.09
--------------------------------------------

IF @Version < '1.09'
BEGIN

EXEC('CREATE TABLE dbo.Tmp_Bounce
	(
	Id uniqueidentifier NOT NULL,
	PopMessageId varchar(1024) NULL,
	MessageId uniqueidentifier NOT NULL,
	CustomerId uniqueidentifier NOT NULL,
	EventTime datetime NOT NULL,
	MessageType int NOT NULL,
	AccountId int NOT NULL,
	Code int NOT NULL,
	Category varchar(255) NULL,
	Domain varchar(255) NULL,
	DiagnosticString varchar(1024) NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Bounce)
	 EXEC('INSERT INTO dbo.Tmp_Bounce (Id, PopMessageId, MessageId, CustomerId, EventTime, MessageType, AccountId, Code, Category, Domain, DiagnosticString)
		SELECT Id, PopMessageId, MessageId, CustomerId, EventTime, MessageType, AccountId, Code, Category, Domain, DiagnosticString FROM dbo.Bounce WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Bounce')

EXECUTE sp_rename N'dbo.Tmp_Bounce', N'Bounce', 'OBJECT' 

EXEC('ALTER TABLE dbo.Bounce ADD CONSTRAINT
	PK_BOUNCE PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_Bounce_PopMessageId ON dbo.Bounce
	(
	PopMessageId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_Bounce_MessageId ON dbo.Bounce
	(
	MessageId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


UPDATE dbo.Settings SET [Value]='1.09' WHERE [Key]='Version'

END

--------------------------------------------
-- Version 1.10
--------------------------------------------

IF @Version < '1.10'
BEGIN

-- Chane field FromName to nvarchar type in table Campaign

EXEC('CREATE TABLE dbo.Tmp_Campaign
	(
	Id uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	Name nvarchar(255) NULL,
	SendingMode int NOT NULL,
	FromName nvarchar(255) NOT NULL,
	FromEmailAddress varchar(255) NOT NULL,
	ReplyToEmailAddress varchar(255) NOT NULL,
	Status int NOT NULL,
	CreationTime datetime NOT NULL,
	ScheduleTime datetime NOT NULL,
	StartingTime datetime NOT NULL,
	LastSentTime datetime NOT NULL,
	Deleted bit NOT NULL,
	ABTestTestPercentage decimal(13, 3) NOT NULL,
	ABTestTestMinutes int NOT NULL,
	ABTestBestFitCriterion int NOT NULL,
	ABTestStatus int NOT NULL,
	ABTestBestFitMessageIndex int NOT NULL,
	Exception varchar(1024) NULL,
	ABTestTestCount int NOT NULL,
	PlannedSubscriberCount int NOT NULL,
	Segment nvarchar(1024) NULL,
	ABTestLastTestSentTime datetime NOT NULL,
	ABTestBestStartingTime datetime NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Campaign)
	 EXEC('INSERT INTO dbo.Tmp_Campaign (Id, AccountId, Name, SendingMode, FromName, FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount, PlannedSubscriberCount, Segment, ABTestLastTestSentTime, ABTestBestStartingTime)
		SELECT Id, AccountId, Name, SendingMode, CONVERT(nvarchar(255), FromName), FromEmailAddress, ReplyToEmailAddress, Status, CreationTime, ScheduleTime, StartingTime, LastSentTime, Deleted, ABTestTestPercentage, ABTestTestMinutes, ABTestBestFitCriterion, ABTestStatus, ABTestBestFitMessageIndex, Exception, ABTestTestCount, PlannedSubscriberCount, Segment, ABTestLastTestSentTime, ABTestBestStartingTime FROM dbo.Campaign WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Campaign')

EXECUTE sp_rename N'dbo.Tmp_Campaign', N'Campaign', 'OBJECT' 

EXEC('ALTER TABLE dbo.Campaign ADD CONSTRAINT
	PK_CAMPAIGN PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


EXEC('CREATE NONCLUSTERED INDEX IDX_Campaign_Query ON dbo.Campaign
	(
	AccountId,
	Deleted,
	Status
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


-- Chane field Settings to nvarchar type in table Account

ExEC('CREATE TABLE dbo.Tmp_Account
	(
	Id int NOT NULL,
	Name nvarchar(255) NULL,
	PublicAccessKey varchar(50) NULL,
	ApiKey varchar(50) NULL,
	Culture varchar(50) NULL,
	TimeZone varchar(50) NULL,
	Encoding varchar(50) NULL,
	Enabled bit NOT NULL,
	CreationTime datetime NOT NULL,
	Settings nvarchar(MAX) NULL,
	Reputation int NOT NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.Account)
	 EXEC('INSERT INTO dbo.Tmp_Account (Id, Name, PublicAccessKey, ApiKey, Culture, TimeZone, Encoding, Enabled, CreationTime, Settings, Reputation)
		SELECT Id, Name, PublicAccessKey, ApiKey, Culture, TimeZone, Encoding, Enabled, CreationTime, CONVERT(nvarchar(MAX), Settings), Reputation FROM dbo.Account WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.Account')

EXECUTE sp_rename N'dbo.Tmp_Account', N'Account', 'OBJECT' 

EXEC('ALTER TABLE dbo.Account ADD CONSTRAINT
	PK_ACCOUNT PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

-- Chane field SignUpFields to nvarchar type in table SubscriberList

EXEC('CREATE TABLE dbo.Tmp_SubscriberList
	(
	Id uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	Name nvarchar(255) NOT NULL,
	ListType int NOT NULL,
	SubscriptionType int NOT NULL,
	CreationTime datetime NOT NULL,
	Deleted bit NOT NULL,
	SignUpFields nvarchar(1024) NULL,
	EnableSignUp bit NOT NULL,
	SignUpRedirectUrl varchar(255) NULL,
	ConfirmUrl varchar(255) NULL,
	ConfirmMailId uniqueidentifier NULL,
	EnableSubscribedMail bit NOT NULL,
	SubscribedMailId uniqueidentifier NULL,
	EnableUnsubscribedMail bit NOT NULL,
	UnsubscribedMailId uniqueidentifier NULL,
	UnsubscribeUrl varchar(255) NULL,
	Description varchar(255) NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.SubscriberList)
	 EXEC('INSERT INTO dbo.Tmp_SubscriberList (Id, AccountId, Name, ListType, SubscriptionType, CreationTime, Deleted, SignUpFields, EnableSignUp, SignUpRedirectUrl, ConfirmUrl, ConfirmMailId, EnableSubscribedMail, SubscribedMailId, EnableUnsubscribedMail, UnsubscribedMailId, UnsubscribeUrl, Description)
		SELECT Id, AccountId, Name, ListType, SubscriptionType, CreationTime, Deleted, CONVERT(nvarchar(1024), SignUpFields), EnableSignUp, SignUpRedirectUrl, ConfirmUrl, ConfirmMailId, EnableSubscribedMail, SubscribedMailId, EnableUnsubscribedMail, UnsubscribedMailId, UnsubscribeUrl, Description FROM dbo.SubscriberList WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.SubscriberList')

EXECUTE sp_rename N'dbo.Tmp_SubscriberList', N'SubscriberList', 'OBJECT' 

EXEC('ALTER TABLE dbo.SubscriberList ADD CONSTRAINT
	PK_SUBSCRIBERLIST PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_SubscriberListName ON dbo.SubscriberList
	(
	AccountId,
	Name
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_SubscriberListQuery ON dbo.SubscriberList
	(
	AccountId,
	Deleted,
	CreationTime
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


-- Change field FromEmailAddress and Subject to nvarchar type in table ListServerForward

EXEC('CREATE TABLE dbo.Tmp_ListServerForward
	(
	Id uniqueidentifier NOT NULL,
	AccountId int NOT NULL,
	ListServerId uniqueidentifier NOT NULL,
	MessageId varchar(255) NULL,
	FromEmailAddress nvarchar(255) NULL,
	Subject nvarchar(255) NULL,
	SentCount int NOT NULL,
	Status int NOT NULL,
	CreationTime datetime NOT NULL,
	StartingTime datetime NOT NULL,
	LastSentTime datetime NOT NULL
	)  ON [PRIMARY]')

IF EXISTS(SELECT * FROM dbo.ListServerForward)
	 EXEC('INSERT INTO dbo.Tmp_ListServerForward (Id, AccountId, ListServerId, MessageId, FromEmailAddress, Subject, SentCount, Status, CreationTime, StartingTime, LastSentTime)
		SELECT Id, AccountId, ListServerId, MessageId, CONVERT(nvarchar(255), FromEmailAddress), CONVERT(nvarchar(255), Subject), SentCount, Status, CreationTime, StartingTime, LastSentTime FROM dbo.ListServerForward WITH (HOLDLOCK TABLOCKX)')

EXEC('DROP TABLE dbo.ListServerForward')

EXECUTE sp_rename N'dbo.Tmp_ListServerForward', N'ListServerForward', 'OBJECT' 

EXEC('ALTER TABLE dbo.ListServerForward ADD CONSTRAINT
	PK_LISTSERVERFORWARD PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_ListServerForward_Query ON dbo.ListServerForward
	(
	AccountId,
	ListServerId,
	CreationTime DESC
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')

EXEC('CREATE NONCLUSTERED INDEX IDX_ListServerForward_MessageId ON dbo.ListServerForward
	(
	MessageId
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]')


UPDATE dbo.Settings SET [Value]='1.10' WHERE [Key]='Version'

END